import { View, Text, Textarea } from '@tarojs/components'
import { ArrowLeft, Send } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.config'

export default function KnowledgeCardInput() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const res: any = await Network.request({
        url: '/api/knowledge-card/generate',
        method: 'POST',
        data: { userContent: content }
      })
      
      if (res.data.code === 200) {
        Taro.navigateTo({
          url: `/pages/knowledge-card/result?data=${encodeURIComponent(JSON.stringify(res.data.data))}`
        })
      } else {
        Taro.showToast({ title: res.data.msg || '生成失败', icon: 'none' })
      }
    } catch (error) {
      Taro.showToast({ title: '网络请求失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-4 flex-shrink-0">
        <View className="flex items-center">
          <View
            className="w-9 h-9 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
            onClick={() => Taro.navigateBack()}
          >
            <ArrowLeft size={22} color="#ffffff" />
          </View>
          <Text className="block text-white text-lg font-semibold ml-3">知识卡片</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 py-4">
        <View className="bg-white rounded-2xl p-4 shadow-sm" style={{ minHeight: '300px' }}>
          <Text className="block text-gray-700 text-base font-medium mb-3">
            输入您想生成的知识内容
          </Text>
          
          <View className="flex-1" style={{ minHeight: '240px' }}>
            <Textarea
              className="w-full text-base text-gray-800 p-3 bg-gray-50 rounded-xl"
              placeholder="请输入知识点内容..."
              value={content}
              onInput={(e: any) => setContent(e.detail.value)}
              style={{ minHeight: '240px', backgroundColor: '#f8fafc' }}
            />
          </View>
          
          <View className="mt-4 flex items-center justify-end">
            <View
              className={`px-6 py-3 rounded-full flex items-center ${loading ? 'bg-gray-300' : 'bg-blue-500'}`}
              onClick={loading ? undefined : handleGenerate}
            >
              <Send size={18} color="#ffffff" className="mr-2" />
              <Text className="block text-white text-sm font-medium">
                {loading ? '生成中...' : '生成'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
