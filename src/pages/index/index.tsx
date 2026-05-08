import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { BookOpen, Construction, ChevronRight, Image as ImageIcon } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.config'

interface RecentChat {
  id: number
  title: string
  preview: string
  time: string
  type: string
  imageUrl?: string
}

interface UserInfo {
  name: string
  avatar: string
  totalCards: number
  totalChats: number
}

export default function Index() {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '用户', avatar: '', totalCards: 0, totalChats: 0 })
  const [recentChats, setRecentChats] = useState<RecentChat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 获取用户信息和统计数据
      const userRes = await Network.request({
        url: '/api/user/info',
        method: 'GET'
      })
      if (userRes.data?.code === 200) {
        setUserInfo(userRes.data.data)
      }

      // 获取最近对话
      const recentRes = await Network.request({
        url: '/api/conversations/recent',
        method: 'GET'
      })
      if (recentRes.data?.code === 200) {
        setRecentChats(recentRes.data.data || [])
      }
    } catch (e) {
      console.error('获取数据失败', e)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { icon: BookOpen, title: '知识卡片', desc: '快速查询知识', color: 'bg-blue-500', available: true, type: 'knowledge' },
    { icon: Construction, title: '待开发', desc: '功能开发中', color: 'bg-slate-300', available: false, type: 'pending' },
  ]

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.available) {
      Taro.navigateTo({ url: '/pages/knowledge-card/index' })
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' })
    }
  }

  const handleChatClick = (chat: RecentChat) => {
    if (chat.type === 'knowledge' && chat.imageUrl) {
      Taro.navigateTo({
        url: `/pages/knowledge-card/result?imageUrl=${encodeURIComponent(chat.imageUrl)}`
      })
    } else {
      Taro.navigateTo({ url: '/pages/chat/index' })
    }
  }

  return (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-6">
        <View className="flex items-center justify-between">
          <View>
            <Text className="block text-white text-lg font-semibold">您好，{userInfo.name}</Text>
            <Text className="block text-blue-100 text-sm mt-1">有什么可以帮您的？</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 mt-4">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="block text-slate-800 text-base font-semibold mb-3">快捷入口</Text>
          <View className="grid grid-cols-4 gap-3">
            {quickActions.map((item, index) => (
              <View
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleQuickAction(item)}
              >
                <View className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-2`}>
                  <item.icon size={22} color="#ffffff" />
                </View>
                <Text className={`block text-xs font-medium ${item.available ? 'text-slate-700' : 'text-slate-400'}`}>
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Recent Chats */}
      <View className="px-4 mt-5">
        <View className="flex items-center justify-between mb-3">
          <Text className="block text-slate-800 text-base font-semibold">最近对话</Text>
          <View
            className="flex items-center"
            onClick={() => Taro.switchTab({ url: '/pages/history/index' })}
          >
            <Text className="block text-slate-500 text-sm">查看全部</Text>
            <ChevronRight size={16} color="#94a3b8" />
          </View>
        </View>

        <View className="bg-white rounded-2xl overflow-hidden">
          {loading ? (
            <View className="p-4 text-center">
              <Text className="block text-slate-400 text-sm">加载中...</Text>
            </View>
          ) : recentChats.length === 0 ? (
            <View className="p-4 text-center">
              <Text className="block text-slate-400 text-sm">暂无对话记录</Text>
            </View>
          ) : (
            recentChats.map((item, index) => (
              <View
                key={item.id}
                className={`p-4 flex items-center ${index !== recentChats.length - 1 ? 'border-b border-slate-100' : ''}`}
                onClick={() => handleChatClick(item)}
              >
                <View className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-3">
                  {item.type === 'knowledge' && item.imageUrl ? (
                    <ImageIcon size={18} color="#2563eb" />
                  ) : (
                    <BookOpen size={18} color="#2563eb" />
                  )}
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="block text-slate-800 text-sm font-medium truncate">{item.title}</Text>
                  <Text className="block text-slate-400 text-xs mt-1 truncate">{item.preview}</Text>
                </View>
                <Text className="text-slate-400 text-xs ml-2 shrink-0">{item.time}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  )
}
