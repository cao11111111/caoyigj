import { View, Text, Image } from '@tarojs/components'
import { ArrowLeft, RefreshCw } from 'lucide-react-taro'
import Taro, { useRouter } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import './result.config'

interface KnowledgeCard {
  title: string;
  coreConcept: string;
  keyPoints: string[];
  memoryTip: string;
  imageUrl?: string;
}

export default function KnowledgeCardResult() {
  const router = useRouter()
  const [card, setCard] = useState<KnowledgeCard | null>(null)

  useEffect(() => {
    const { data } = router.params
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data))
        setCard(parsed)
      } catch (e) {
        Taro.showToast({ title: '数据解析失败', icon: 'none' })
      }
    }
  }, [router.params])

  if (!card) {
    return (
      <View className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Text className="block text-slate-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-4">
        <View className="flex items-center justify-between">
          <View className="flex items-center">
            <View
              className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
              onClick={() => Taro.navigateBack()}
            >
              <ArrowLeft size={20} color="#ffffff" />
            </View>
            <Text className="block text-white text-lg font-semibold ml-3">知识卡片</Text>
          </View>
          <View
            className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
            onClick={() => Taro.navigateBack()}
          >
            <RefreshCw size={18} color="#ffffff" />
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="px-4 mt-4">
        {/* Generated Image */}
        {card.imageUrl && (
          <View className="mb-4">
            <Image
              src={card.imageUrl}
              mode="widthFix"
              className="w-full rounded-2xl shadow-sm"
              style={{ backgroundColor: '#f1f5f9' }}
            />
          </View>
        )}

        {/* Title */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <Text className="block text-slate-800 text-xl font-bold">{card.title}</Text>
        </View>

        {/* Core Concept */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <Text className="block text-blue-500 text-sm font-semibold mb-2">核心概念</Text>
          <Text className="block text-slate-700 text-sm leading-relaxed">{card.coreConcept}</Text>
        </View>

        {/* Key Points */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <Text className="block text-blue-500 text-sm font-semibold mb-3">关键要点</Text>
          <View className="space-y-2">
            {card.keyPoints.map((point, index) => (
              <View key={index} className="flex items-start">
                <View className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-1">
                  <Text className="block text-blue-500 text-xs font-medium">{index + 1}</Text>
                </View>
                <Text className="block text-slate-700 text-sm flex-1 leading-relaxed">{point}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Memory Tip */}
        <View className="bg-blue-50 rounded-2xl p-4 shadow-sm mb-3">
          <Text className="block text-blue-500 text-sm font-semibold mb-2">记忆口诀</Text>
          <Text className="block text-slate-700 text-sm leading-relaxed">{card.memoryTip}</Text>
        </View>
      </View>
    </View>
  )
}
