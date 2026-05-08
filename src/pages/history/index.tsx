import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import { Image as ImageIcon, BookOpen, Clock, BookMarked } from 'lucide-react-taro'
import './index.config'

interface ChatItem {
  id: number
  title: string
  preview: string
  time: string
  type: string
  imageUrl?: string
}

interface GroupedChats {
  title: string
  data: ChatItem[]
}

export default function History() {
  const [groupedChats, setGroupedChats] = useState<GroupedChats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.reLaunch({ url: '/pages/login/index' })
      return
    }
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await Network.request({
        url: '/api/conversations/history',
        method: 'GET'
      })
      if (res.data?.code === 200) {
        setGroupedChats(res.data.data || [])
      }
    } catch (e) {
      console.error('获取历史记录失败', e)
    } finally {
      setLoading(false)
    }
  }

  const handleChatClick = (chat: ChatItem) => {
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
      {/* 顶部区域 */}
      <View className="bg-blue-500 px-5 pt-12 pb-6">
        <View className="flex items-center">
          <Clock size={24} color="#ffffff" />
          <Text className="block text-white text-xl font-bold ml-2">对话历史</Text>
        </View>
      </View>

      {/* 历史列表 */}
      <View className="px-4 mt-4">
        {loading ? (
          <View className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <View className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
              <Clock size={24} color="#CBD5E1" />
            </View>
            <Text className="block text-slate-400 text-sm">加载中...</Text>
          </View>
        ) : groupedChats.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <View className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <BookMarked size={32} color="#CBD5E1" />
            </View>
            <Text className="block text-slate-500 text-base font-medium">暂无历史记录</Text>
            <Text className="block text-slate-400 text-sm mt-2">点击首页快捷入口开始使用</Text>
          </View>
        ) : (
          groupedChats.map((group) => (
            <View key={group.title} className="mb-5">
              <View className="flex items-center mb-3">
                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <Text className="block text-slate-600 text-sm font-medium">{group.title}</Text>
              </View>
              <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {group.data.map((item, index) => (
                  <View
                    key={item.id}
                    className={`p-4 flex items-center ${index !== group.data.length - 1 ? 'border-b border-slate-100' : ''}`}
                    onClick={() => handleChatClick(item)}
                  >
                    <View className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3">
                      {item.type === 'knowledge' && item.imageUrl ? (
                        <ImageIcon size={22} color="#2563EB" />
                      ) : (
                        <BookOpen size={22} color="#2563EB" />
                      )}
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="block text-slate-800 text-sm font-medium truncate">{item.title}</Text>
                      <Text className="block text-slate-400 text-xs mt-1 truncate">{item.preview}</Text>
                    </View>
                    <View className="flex flex-col items-end ml-3">
                      <Text className="text-slate-400 text-xs">{item.time}</Text>
                      <View className="bg-blue-50 px-2 py-1 rounded mt-1">
                        <Text className="text-blue-500 text-xs">查看</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  )
}
