import { View, Text } from '@tarojs/components'
import { ArrowLeft, Send } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import { Input } from '@/components/ui/input'
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
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-4">
        <View className="flex items-center">
          <View
            className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
            onClick={() => Taro.navigateBack()}
          >
            <ArrowLeft size={20} color="#ffffff" />
          </View>
          <Text className="block text-white text-lg font-semibold ml-3">知识卡片</Text>
        </View>
      </View>

      {/* Input Area */}
      <View className="px-4 mt-4">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="block text-slate-700 text-sm font-medium mb-3">
            输入您想生成的知识内容
          </Text>
          
          <View className="bg-slate-50 rounded-xl px-4 py-3 min-h-32">
            <Input
              className="w-full text-base text-slate-800"
              placeholder="请输入知识点内容..."
              value={content}
              onInput={(e: any) => setContent(e.detail.value)}
            />
          </View>
          
          <View className="mt-3 flex items-center justify-end">
            <View
              className={`px-6 py-2 rounded-full flex items-center ${loading ? 'bg-slate-300' : 'bg-blue-500'}`}
              onClick={loading ? undefined : handleGenerate}
            >
              <Send size={16} color="#ffffff" className="mr-2" />
              <Text className="block text-white text-sm font-medium">
                {loading ? '生成中...' : '生成'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tips */}
      <View className="px-4 mt-6">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="block text-slate-700 text-sm font-medium mb-2">使用提示</Text>
          <Text className="block text-slate-500 text-xs leading-relaxed">
            输入您想了解的任何知识点，比如&quot;光合作用是什么&quot;、&quot;勾股定理的由来&quot;等，系统将为您生成一份适合师生阅读的知识卡片。
          </Text>
        </View>
      </View>
    </View>
  )
}
