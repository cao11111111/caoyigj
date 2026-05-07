import { View, Text } from '@tarojs/components'
import { ArrowLeft } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
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
      const res: any = await Taro.request({
        url: '/api/knowledge-card/generate',
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        data: { userContent: content },
        timeout: 600000 // 10分钟
      })
      
      if (res.data.code === 200) {
        Taro.navigateTo({
          url: `/pages/knowledge-card/result?data=${encodeURIComponent(JSON.stringify(res.data.data))}`
        })
      } else {
        Taro.showToast({ title: res.data.msg || '生成失败', icon: 'none' })
      }
    } catch (error) {
      console.error('生成失败:', error)
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
          <ArrowLeft 
            className="mr-4" 
            color="#fff" 
            size={24}
            onClick={() => Taro.navigateBack()}
          />
          <Text className="block text-white text-lg font-medium">知识卡片</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 p-4 flex flex-col">
        <View className="flex-1 mb-4">
          <Text className="block text-gray-500 text-sm mb-2">输入培训内容</Text>
          <View className="bg-white rounded-xl flex-1" style={{ minHeight: '360px' }}>
            {Taro.getEnv() === Taro.ENV_TYPE.WEB ? (
              <textarea
                className="w-full h-full p-3 border-0 outline-none resize-none text-sm"
                style={{ minHeight: '360px' }}
                placeholder="请输入培训内容..."
                value={content}
                onChange={(e: any) => handleInput({ target: { value: e.target.value } })}
              />
            ) : (
              <Textarea
                className="w-full h-full"
                style={{ minHeight: '360px' }}
                placeholder="请输入培训内容..."
                value={content}
                onInput={(e: any) => handleInput(e)}
                maxlength={-1}
              />
            )}
          </View>
        </View>

        {/* Generate Button */}
        <View className="flex-shrink-0">
          <View 
            className={`rounded-xl py-4 text-center ${loading ? 'bg-gray-400' : 'bg-blue-500'} active:opacity-80`}
            onClick={loading ? undefined : handleGenerate}
          >
            <Text className="block text-white text-base font-medium">
              {loading ? '生成中...' : '生成知识卡片'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
