import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import { ChevronRight, Image as ImageIcon, BookOpen } from 'lucide-react-taro'
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
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-6">
        <Text className="block text-white text-xl font-semibold">对话历史</Text>
      </View>

      {/* History List */}
      <View className="px-4 mt-4">
        {loading ? (
          <View className="bg-white rounded-2xl p-8 text-center">
            <Text className="block text-slate-400 text-sm">加载中...</Text>
          </View>
        ) : groupedChats.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 text-center">
            <Text className="block text-slate-400 text-sm">暂无历史记录</Text>
          </View>
        ) : (
          groupedChats.map((group) => (
            <View key={group.title} className="mb-4">
              <Text className="block text-slate-500 text-sm font-medium mb-2">{group.title}</Text>
              <View className="bg-white rounded-2xl overflow-hidden">
                {group.data.map((item, index) => (
                  <View
                    key={item.id}
                    className={`p-4 flex items-center ${index !== group.data.length - 1 ? 'border-b border-slate-100' : ''}`}
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
                    <ChevronRight size={16} color="#94a3b8" />
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
