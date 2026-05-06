import { View, Text, ScrollView } from '@tarojs/components'
import { BookOpen, RefreshCw, Copy, ArrowLeft, Lightbulb, BookMarked, MessageSquare } from 'lucide-react-taro'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import './result.config'

interface KnowledgeCard {
  title: string
  coreConcept: string
  keyPoints: string[]
  memoryTip: string
}

export default function KnowledgeCardResult() {
  const [loading, setLoading] = useState(true)
  const [card, setCard] = useState<KnowledgeCard | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const { topic } = (Taro.getCurrentInstance().router?.params || {}) as { topic?: string }
    if (topic) {
      fetchKnowledgeCard(decodeURIComponent(topic))
    }
  }, [])

  const fetchKnowledgeCard = async (topic: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await Network.request({
        url: '/api/knowledge-card/generate',
        method: 'POST',
        data: { topic }
      })
      console.log('知识卡片响应:', res.data)
      if (res.data?.code === 200 && res.data?.data) {
        setCard(res.data.data)
      } else {
        setError(res.data?.msg || '生成失败')
      }
    } catch (err: any) {
      console.error('请求错误:', err)
      setError(err.message || '网络请求失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    const { topic } = (Taro.getCurrentInstance().router?.params || {}) as { topic?: string }
    if (topic) {
      fetchKnowledgeCard(decodeURIComponent(topic))
    }
  }

  const handleCopy = () => {
    if (!card) return
    const content = `${card.title}\n\n核心概念：${card.coreConcept}\n\n关键要点：\n${card.keyPoints.map(p => `• ${p}`).join('\n')}\n\n记忆口诀：${card.memoryTip}`
    Taro.setClipboardData({
      data: content,
      success: () => Taro.showToast({ title: '已复制', icon: 'success' })
    })
  }

  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-5">
        <View className="flex items-center justify-between">
          <View className="flex items-center" onClick={handleBack}>
            <ArrowLeft size={22} color="#ffffff" />
            <Text className="block text-white ml-2">返回</Text>
          </View>
          <Text className="text-white font-semibold">生成结果</Text>
          <View className="w-14" />
        </View>
      </View>

      {/* Content */}
      <ScrollView scrollY className="px-4 mt-4" style={{ height: 'calc(100vh - 180px)' }}>
        {loading ? (
          <View className="flex flex-col items-center justify-center py-20">
            <View className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <Text className="block text-slate-500 mt-4">正在生成知识卡片...</Text>
          </View>
        ) : error ? (
          <View className="bg-white rounded-2xl p-6 text-center">
            <Text className="block text-red-500 mb-4">{error}</Text>
            <View className="bg-blue-500 rounded-xl py-3 px-6 inline-flex items-center" onClick={handleRegenerate}>
              <RefreshCw size={18} color="#ffffff" />
              <Text className="text-white ml-2">重新生成</Text>
            </View>
          </View>
        ) : card ? (
          <View className="space-y-4">
            {/* Title Card */}
            <View className="bg-blue-500 rounded-2xl p-5 text-center">
              <BookOpen size={32} color="#ffffff" className="mx-auto mb-2" />
              <Text className="block text-white text-xl font-bold">{card.title}</Text>
            </View>

            {/* Core Concept */}
            <View className="bg-white rounded-2xl p-4">
              <View className="flex items-center mb-3">
                <View className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <Lightbulb size={16} color="#2563eb" />
                </View>
                <Text className="text-slate-800 font-semibold">核心概念</Text>
              </View>
              <Text className="block text-slate-600 text-sm leading-6">{card.coreConcept}</Text>
            </View>

            {/* Key Points */}
            <View className="bg-white rounded-2xl p-4">
              <View className="flex items-center mb-3">
                <View className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                  <BookMarked size={16} color="#16a34a" />
                </View>
                <Text className="text-slate-800 font-semibold">关键要点</Text>
              </View>
              <View className="space-y-2">
                {card.keyPoints.map((point, index) => (
                  <View key={index} className="flex items-start">
                    <View className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2 mt-1">
                      <Text className="text-white text-xs">{index + 1}</Text>
                    </View>
                    <Text className="text-slate-600 text-sm flex-1">{point}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Memory Tip */}
            <View className="bg-amber-50 rounded-2xl p-4">
              <View className="flex items-center mb-3">
                <View className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-2">
                  <MessageSquare size={16} color="#d97706" />
                </View>
                <Text className="text-amber-700 font-semibold">记忆口诀</Text>
              </View>
              <Text className="block text-amber-700 text-sm leading-6 italic">{card.memoryTip}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom Actions */}
      {!loading && card && (
        <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-around">
          <View className="flex flex-col items-center" onClick={handleRegenerate}>
            <RefreshCw size={20} color="#64748b" />
            <Text className="text-slate-500 text-xs mt-1">重新生成</Text>
          </View>
          <View className="flex flex-col items-center" onClick={handleCopy}>
            <Copy size={20} color="#64748b" />
            <Text className="text-slate-500 text-xs mt-1">复制内容</Text>
          </View>
        </View>
      )}
    </View>
  )
}
