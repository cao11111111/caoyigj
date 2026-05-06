import { useEffect, useState } from "react"
import Taro from "@tarojs/taro"
import { View, Text, Image } from "@tarojs/components"
import { Network } from "@/network"
import "./result.css"

export default function KnowledgeCardResult() {
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      const eventChannel = (Taro.getCurrentInstance().page as any)?.getOpenerEventChannel()
      if (eventChannel?.on) {
        eventChannel.on("result", async (data: { topic: string }) => {
          if (data?.topic) {
            await generateCard(data.topic)
          }
        })
      }
    } catch (e) {
      console.error("EventChannel error:", e)
    }
  }, [])

  const generateCard = async (topic: string) => {
    setLoading(true)
    setError("")
    
    try {
      const res = await Network.request({
        url: "/api/knowledge-card/generate",
        method: "POST",
        data: { topic }
      })
      
      console.log("生成结果:", res.data)
      
      if (res.data?.code === 200 && res.data?.data?.imageUrl) {
        setImageUrl(res.data.data.imageUrl)
      } else {
        setError(res.data?.msg || "生成失败")
      }
    } catch (err) {
      console.error("生成失败:", err)
      setError("网络错误，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="result-container">
      <View className="content-card">
        {loading ? (
          <View className="loading-state">
            <View className="loading-icon">
              <Text className="block text-4xl">🎨</Text>
            </View>
            <Text className="block text-gray500 mt-4">正在生成知识卡片...</Text>
          </View>
        ) : error ? (
          <View className="error-state">
            <Text className="block text-gray500 text-center mb-4">{error}</Text>
            <View 
              className="bg-primary text-white rounded-2xl py-3 text-center"
              onClick={() => Taro.navigateBack()}
            >
              <Text>返回重试</Text>
            </View>
          </View>
        ) : (
          <View className="success-state">
            <Text className="block text-lg font-semibold text-gray800 mb-4 text-center">
              知识卡片已生成
            </Text>
            <View className="image-wrapper">
              <Image 
                src={imageUrl} 
                className="result-image"
                mode="aspectFit"
                showMenuByLongpress
              />
            </View>
            <View className="mt-4 flex gap-3">
              <View 
                className="flex-1 bg-gray100 text-gray700 rounded-2xl py-3 text-center"
                onClick={() => Taro.navigateBack()}
              >
                <Text>继续生成</Text>
              </View>
              <View 
                className="flex-1 bg-primary text-white rounded-2xl py-3 text-center"
                onClick={() => {
                  Taro.showToast({ title: "已保存", icon: "success" })
                }}
              >
                <Text>保存图片</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
