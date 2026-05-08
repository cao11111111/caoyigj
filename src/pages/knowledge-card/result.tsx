import { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import { ArrowLeft, Download, RefreshCw, Check } from 'lucide-react-taro'
import './result.css'

export default function KnowledgeCardResult() {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getData = async () => {
      try {
        const eventChannel = Taro.getCurrentInstance().page?.getOpenerEventChannel?.()
        if (eventChannel) {
          const data = await new Promise((resolve) => {
            eventChannel.on('imageData', (res) => resolve(res))
            setTimeout(() => resolve(null), 100)
          })
          if (data && (data as any).imageUrl) {
            setImageUrl((data as any).imageUrl)
            setLoading(false)
            return
          }
        }

        const params = (Taro.getCurrentInstance().router?.params || {}) as any
        if (params.data) {
          try {
            const decoded = decodeURIComponent(params.data)
            const data = JSON.parse(decoded)
            if (data.imageUrl) {
              setImageUrl(data.imageUrl)
              setLoading(false)
              return
            }
          } catch (e) {
            console.error('解析参数失败:', e)
          }
        }

        setError('未获取到图片，请重新生成')
      } catch (err) {
        console.error('获取数据失败:', err)
        setError('获取数据失败')
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [])

  const handleSave = async () => {
    if (!imageUrl) return

    try {
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        Taro.showLoading({ title: '保存中...' })
        const { tempFilePath } = await Network.downloadFile({ url: imageUrl })
        await Taro.saveImageToPhotosAlbum({ filePath: tempFilePath })
        Taro.hideLoading()
        Taro.showToast({ title: '保存成功', icon: 'success' })
      } else {
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = `知识卡片_${Date.now()}.png`
        link.click()
        Taro.showToast({ title: '开始下载', icon: 'success' })
      }
    } catch (err) {
      console.error('保存失败:', err)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
  }

  const handleGoBack = () => {
    Taro.navigateBack()
  }

  // 加载中
  if (loading) {
    return (
      <View className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <View className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <View className="animate-spin">
            <RefreshCw size={36} color="#2563EB" />
          </View>
        </View>
        <Text className="block text-slate-800 text-lg font-semibold">正在生成知识卡片</Text>
        <Text className="block text-slate-400 text-sm mt-2">请稍候，马上就好</Text>
      </View>
    )
  }

  // 错误状态
  if (error || !imageUrl) {
    return (
      <View className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <View className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Text className="text-red-500 text-3xl font-bold">!</Text>
        </View>
        <Text className="block text-slate-800 text-lg font-semibold mb-2">生成失败</Text>
        <Text className="block text-slate-400 text-sm text-center mb-8">{error || '未获取到图片'}</Text>
        <Button className="bg-blue-500 text-white px-8 py-3 rounded-xl" onClick={handleGoBack}>
          返回重试
        </Button>
      </View>
    )
  }

  // 成功显示图片
  return (
    <View className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-4 flex-shrink-0 shadow-md">
        <View className="flex items-center">
          <ArrowLeft 
            className="p-2 mr-2"
            color="#fff" 
            size={22}
            onClick={handleGoBack}
          />
          <Text className="block text-white text-lg font-semibold">生成成功</Text>
        </View>
      </View>

      {/* 成功提示 */}
      <View className="bg-green-50 mx-4 mt-4 p-3 rounded-xl flex-row items-center">
        <Check size={18} color="#10B981" className="mr-2" />
        <Text className="block text-green-700 text-sm font-medium">知识卡片已生成</Text>
      </View>

      {/* 图片展示 */}
      <View className="flex-1 p-4 flex items-center justify-center">
        <View className="bg-white rounded-2xl shadow-lg p-3 w-full max-w-md">
          <Image
            className="w-full rounded-xl"
            src={imageUrl}
            mode="widthFix"
            showMenuByLongpress
          />
        </View>
      </View>

      {/* 底部操作 */}
      <View className="p-4 pb-8 flex-shrink-0">
        <View className="flex gap-3">
          <Button 
            className="flex-1 py-4 rounded-xl border border-slate-200 bg-white" 
            onClick={handleGoBack}
          >
            <View className="flex items-center justify-center">
              <RefreshCw size={16} color="#475569" className="mr-2" />
              <Text className="text-slate-600 text-sm font-medium">再试一张</Text>
            </View>
          </Button>
          <Button 
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-md shadow-blue-200" 
            onClick={handleSave}
          >
            <View className="flex items-center justify-center">
              <Download size={16} color="#ffffff" className="mr-2" />
              <Text className="text-white text-sm font-medium">保存图片</Text>
            </View>
          </Button>
        </View>
      </View>
    </View>
  )
}
