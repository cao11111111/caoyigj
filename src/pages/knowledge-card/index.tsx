import { View, Text } from '@tarojs/components'
import { BookOpen, Sparkles } from 'lucide-react-taro'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { Textarea } from '@/components/ui/textarea'
import './index.config'

export default function KnowledgeCardInput() {
  const [topic, setTopic] = useState('')

  const handleGenerate = () => {
    if (!topic.trim()) {
      Taro.showToast({ title: '请输入主题内容', icon: 'none' })
      return
    }
    Taro.navigateTo({
      url: `/pages/knowledge-card/result?topic=${encodeURIComponent(topic.trim())}`
    })
  }

  const exampleTopics = ['光合作用', '勾股定理', '唐诗三百首', '太阳系八大行星', '水的三态变化']

  return (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-6">
        <View className="flex items-center">
          <BookOpen size={24} color="#ffffff" />
          <Text className="block text-white text-lg font-semibold ml-3">知识卡片生成</Text>
        </View>
        <Text className="block text-blue-100 text-sm mt-2">
          输入任意主题，AI 将为您生成一份适合学校师生阅读的知识卡片
        </Text>
      </View>

      {/* Input Area */}
      <View className="px-4 mt-5">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="block text-slate-700 text-sm font-medium mb-3">请输入您想了解的主题</Text>
          <View className="bg-slate-50 rounded-xl px-4 py-3">
            <Textarea
              className="w-full text-slate-800 text-base min-h-10 leading-6"
              placeholder="例如：光合作用、三角形面积公式、历史人物..."
              placeholderClass="text-slate-400"
              value={topic}
              onInput={(e) => setTopic(e.detail.value)}
              maxlength={100}
              autoHeight
            />
          </View>
          <Text className="block text-slate-400 text-xs mt-2">最多 100 个字符</Text>
        </View>

        {/* Examples */}
        <View className="mt-5">
          <Text className="block text-slate-500 text-sm mb-3">试试这些主题</Text>
          <View className="flex flex-wrap gap-2">
            {exampleTopics.map((item) => (
              <View
                key={item}
                className="bg-white px-3 py-2 rounded-full border border-slate-200"
                onClick={() => setTopic(item)}
              >
                <Text className="block text-slate-600 text-sm">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Generate Button */}
      <View className="px-4 mt-8">
        <View
          className="bg-blue-500 rounded-2xl py-4 flex items-center justify-center"
          onClick={handleGenerate}
        >
          <Sparkles size={20} color="#ffffff" />
          <Text className="block text-white font-semibold ml-2">生成知识卡片</Text>
        </View>
      </View>

      {/* Info */}
      <View className="px-4 mt-6">
        <View className="bg-blue-50 rounded-xl p-4">
          <Text className="block text-blue-700 text-sm font-medium mb-2">关于知识卡片</Text>
          <Text className="block text-blue-600 text-xs leading-6">
            知识卡片是一种简洁易懂的知识点呈现方式，包含核心概念、关键要点、记忆口诀等内容，帮助师生快速掌握重点知识。
          </Text>
        </View>
      </View>
    </View>
  )
}
