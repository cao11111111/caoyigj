import { View, Text } from '@tarojs/components'
import { ArrowLeft, Sparkles, BookOpen, Wand } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Network } from '@/network'
import './index.config'

export default function KnowledgeCardInput() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInput = (e: any) => {
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
        header: { 'Content-Type': 'application/json' },
        data: { userContent: content },
        timeout: 600000
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
    <View className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 pt-12 pb-5 flex-shrink-0 shadow-md">
        <View className="flex items-center">
          <ArrowLeft 
            className="p-2 mr-2"
            color="#fff" 
            size={22}
            onClick={() => Taro.navigateBack()}
          />
          <View className="flex items-center">
            <BookOpen size={22} color="#ffffff" />
            <Text className="block text-white text-lg font-semibold ml-2">知识卡片</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 p-4 flex flex-col">
        {/* 提示卡片 */}
        <View className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 mb-4 flex-row items-center">
          <Sparkles size={20} color="#2563EB" className="mr-3 flex-shrink-0" />
          <View>
            <Text className="block text-blue-700 text-sm font-medium">智能生成</Text>
            <Text className="block text-blue-600 text-xs mt-1">输入内容后，系统将自动生成手绘风格知识卡片</Text>
          </View>
        </View>

        {/* 输入区域 */}
        <View className="flex-1 mb-4">
          <Text className="block text-slate-600 text-sm font-medium mb-2">输入培训内容</Text>
          <View className="bg-white rounded-2xl flex-1 shadow-sm border border-slate-100">
            {Taro.getEnv() === Taro.ENV_TYPE.WEB ? (
              <textarea
                className="w-full h-full p-4 border-0 outline-none resize-none text-sm leading-relaxed"
                style={{ minHeight: '320px' }}
                placeholder="请输入要生成知识卡片的内容...\n\n例如：\n• 消防安全知识\n• 校园礼仪规范\n• 健康教育知识"
                value={content}
                onChange={(e: any) => handleInput({ target: { value: e.target.value } })}
              />
            ) : (
              <Textarea
                className="w-full h-full p-4"
                style={{ minHeight: '320px' }}
                placeholder="请输入要生成知识卡片的内容..."
                value={content}
                onInput={(e: any) => handleInput(e)}
                maxlength={-1}
              />
            )}
          </View>
        </View>

        {/* 字数提示 */}
        <View className="flex justify-end mb-3">
          <Text className="text-slate-400 text-xs">{content.length} 字</Text>
        </View>

        {/* Generate Button */}
        <View className="flex-shrink-0">
          <View 
            className={`rounded-2xl py-4 flex items-center justify-center shadow-md ${loading ? 'bg-slate-400' : 'bg-gradient-to-r from-blue-500 to-blue-600'} active:opacity-90`}
            onClick={loading ? undefined : handleGenerate}
          >
            {loading ? (
              <Text className="block text-white text-base font-medium">生成中...</Text>
            ) : (
              <View className="flex items-center">
                <Wand size={20} color="#ffffff" className="mr-2" />
                <Text className="block text-white text-base font-medium">生成知识卡片</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}
