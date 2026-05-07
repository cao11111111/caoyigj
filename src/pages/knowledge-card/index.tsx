import { View, Text } from '@tarojs/components'
import { ArrowLeft, Send } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.config'

export default function KnowledgeCardInput() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInput = (e: any) => {
    // H5 端 textarea 返回 e.target.value，小程序端返回 e.detail.value
    const value = e.detail?.value ?? e.target?.value ?? ''
    setContent(value)
  }

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

      {/* Main Content */}
      <View className="flex-1 px-4 py-4 flex flex-col">
        <Text className="block text-gray-600 text-sm mb-2">请输入您想生成的知识内容</Text>
        
        <View className="flex-1 bg-white rounded-2xl p-4 flex flex-col" style={{ minHeight: '400px' }}>
          <View className="flex-1">
            {/* 小程序端使用 Textarea */}
            {Taro.getEnv() !== 'WEB' ? (
              <View style={{ height: '360px' }}>
                <Textarea
                  className="w-full h-full text-base text-gray-800 p-3 bg-gray-50 rounded-xl"
                  placeholder="请输入知识点内容..."
                  value={content}
                  onInput={handleInput}
                  style={{ backgroundColor: '#f8fafc' }}
                />
              </View>
            ) : (
              /* H5 端使用原生 textarea */
              <View style={{ height: '360px', backgroundColor: '#f8fafc', borderRadius: '12px', padding: '12px' }}>
                <textarea
                  className="w-full h-full text-base text-gray-800 border-0 outline-none resize-none"
                  placeholder="请输入知识点内容..."
                  value={content}
                  onChange={handleInput}
                  style={{ backgroundColor: 'transparent', fontFamily: 'inherit' }}
                />
              </View>
            )}
          </View>
          
          <View className="mt-4 flex justify-end">
            <View
              className={`px-6 py-3 rounded-full flex items-center flex-row ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
              onClick={loading ? undefined : handleGenerate}
            >
              <Send size={18} color="#ffffff" />
              <Text className="block text-white text-sm font-medium ml-2">
                {loading ? '生成中...' : '生成'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
