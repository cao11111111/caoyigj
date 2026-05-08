import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { BookOpen, Construction, ChevronRight, Image as ImageIcon, Sparkles, Clock } from 'lucide-react-taro'
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
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.reLaunch({ url: '/pages/login/index' })
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const userRes = await Network.request({
        url: '/api/user/info',
        method: 'GET'
      })
      if (userRes.data?.code === 200) {
        setUserInfo(userRes.data.data)
      }

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
    { icon: BookOpen, title: '知识卡片', desc: '生成教学卡片', color: 'bg-gradient-to-br from-blue-500 to-blue-600', available: true, type: 'knowledge' },
    { icon: Construction, title: '待开发', desc: '功能开发中', color: 'bg-gradient-to-br from-slate-400 to-slate-500', available: false, type: 'pending' },
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
      {/* 顶部欢迎区域 */}
      <View className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 px-5 pt-12 pb-8 relative overflow-hidden">
        {/* 装饰 */}
        <View className="absolute top-16 right-8 w-40 h-40 bg-white opacity-5 rounded-full" />
        <View className="absolute bottom-2 left-2 w-24 h-24 bg-white opacity-5 rounded-full" />
        
        <View className="relative z-10">
          <View className="flex items-center mb-3">
            <View className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <Text className="text-2xl">👋</Text>
            </View>
            <View>
              <Text className="block text-white text-xl font-bold">{userInfo.name}</Text>
              <Text className="block text-blue-100 text-sm mt-1">欢迎使用曹一工具箱</Text>
            </View>
          </View>
          
          {/* 统计卡片 */}
          <View className="flex gap-3 mt-5">
            <View className="flex-1 bg-white bg-opacity-20 rounded-xl p-3">
              <View className="flex items-center">
                <BookOpen size={16} color="#ffffff" />
                <Text className="text-white text-xs ml-2">卡片总数</Text>
              </View>
              <Text className="block text-white text-2xl font-bold mt-1">{userInfo.totalCards}</Text>
            </View>
            <View className="flex-1 bg-white bg-opacity-20 rounded-xl p-3">
              <View className="flex items-center">
                <Clock size={16} color="#ffffff" />
                <Text className="text-white text-xs ml-2">对话次数</Text>
              </View>
              <Text className="block text-white text-2xl font-bold mt-1">{userInfo.totalChats}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 快捷入口 */}
      <View className="px-4 -mt-4">
        <View className="bg-white rounded-2xl p-4 shadow-md">
          <View className="flex items-center justify-between mb-4">
            <View className="flex items-center">
              <Sparkles size={18} color="#2563EB" />
              <Text className="block text-slate-800 text-base font-semibold ml-2">快捷入口</Text>
            </View>
          </View>
          
          <View className="grid grid-cols-4 gap-4">
            {quickActions.map((item, index) => (
              <View
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleQuickAction(item)}
              >
                <View className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-2 shadow-md`}>
                  <item.icon size={24} color="#ffffff" />
                </View>
                <Text className={`block text-sm font-medium ${item.available ? 'text-slate-700' : 'text-slate-400'}`}>
                  {item.title}
                </Text>
                <Text className="block text-slate-400 text-xs mt-1">{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 最近对话 */}
      <View className="px-4 mt-5">
        <View className="flex items-center justify-between mb-4">
          <View className="flex items-center">
            <Clock size={18} color="#475569" />
            <Text className="block text-slate-800 text-base font-semibold ml-2">最近对话</Text>
          </View>
          <View
            className="flex items-center"
            onClick={() => Taro.switchTab({ url: '/pages/history/index' })}
          >
            <Text className="block text-slate-500 text-sm">查看全部</Text>
            <ChevronRight size={16} color="#94a3b8" />
          </View>
        </View>

        <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <View className="p-8 text-center">
              <Text className="block text-slate-400 text-sm">加载中...</Text>
            </View>
          ) : recentChats.length === 0 ? (
            <View className="p-8 text-center">
              <View className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                <BookOpen size={28} color="#CBD5E1" />
              </View>
              <Text className="block text-slate-400 text-sm">暂无对话记录</Text>
              <Text className="block text-slate-300 text-xs mt-1">点击快捷入口开始使用</Text>
            </View>
          ) : (
            recentChats.map((item, index) => (
              <View
                key={item.id}
                className={`p-4 flex items-center ${index !== recentChats.length - 1 ? 'border-b border-slate-100' : ''}`}
                onClick={() => handleChatClick(item)}
              >
                <View className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3">
                  {item.type === 'knowledge' && item.imageUrl ? (
                    <ImageIcon size={20} color="#2563EB" />
                  ) : (
                    <BookOpen size={20} color="#2563EB" />
                  )}
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="block text-slate-800 text-sm font-medium truncate">{item.title}</Text>
                  <Text className="block text-slate-400 text-xs mt-1 truncate">{item.preview}</Text>
                </View>
                <View className="flex flex-col items-end ml-2">
                  <Text className="text-slate-400 text-xs">{item.time}</Text>
                  <View className="bg-blue-50 px-2 py-1 rounded mt-1">
                    <Text className="text-blue-500 text-xs">知识卡片</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  )
}
