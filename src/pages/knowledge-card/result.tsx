import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import { Button } from '@/components/ui/button'
import './result.css'

interface ImageData {
  imageUrl: string
}

export default function KnowledgeCardResult() {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('Result page mounted')
    
    // 从 eventChannel 获取数据（小程序端）
    try {
      const currentInstance = Taro.getCurrentInstance()
      const eventChannel = currentInstance?.page?.getOpenerEventChannel?.()
      if (eventChannel) {
        eventChannel.on('imageData', (data: ImageData) => {
          console.log('从eventChannel获取数据:', data)
          if (data?.imageUrl) {
            setImageUrl(data.imageUrl)
            setLoading(false)
          }
        })
      }
    } catch (e) {
      console.error('eventChannel获取失败:', e)
    }

    // 从路由参数获取（H5端）
    try {
      const currentInstance = Taro.getCurrentInstance()
      const params = currentInstance?.router?.params
      console.log('路由参数:', params)
      
      if (params?.imageUrl) {
        console.log('直接从参数获取imageUrl:', params.imageUrl)
        setImageUrl(params.imageUrl)
        setLoading(false)
      } else if (params?.data) {
        const decodedData = decodeURIComponent(params.data)
        console.log('解码后的data:', decodedData)
        const parsed: ImageData = JSON.parse(decodedData)
        if (parsed.imageUrl) {
          setImageUrl(parsed.imageUrl)
          setLoading(false)
        }
      }
    } catch (e) {
      console.error('路由参数获取失败:', e)
    }
    
    // 设置超时，如果30秒后还是loading状态则显示错误
    const timer = setTimeout(() => {
      if (loading && !imageUrl) {
        setError('获取图片失败，请返回重试')
        setLoading(false)
      }
    }, 30000)
    
    return () => clearTimeout(timer)
  }, [loading, imageUrl])

  // 保存图片到相册
  const handleSave = async () => {
    try {
      Taro.showLoading({ title: '保存中...' })
      
      // 下载图片
      const res = await Network.downloadFile({ url: imageUrl })
      
      if (res.statusCode === 200) {
        // 保存到相册
        await Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })
        Taro.hideLoading()
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        })
      } else {
        Taro.hideLoading()
        Taro.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    } catch (e) {
      console.error('保存失败:', e)
      Taro.hideLoading()
      Taro.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  }

  // 返回上一页
  const handleGoBack = () => {
    Taro.navigateBack()
  }

  if (loading) {
    return (
      <View className="result-page">
        <View className="loading-container">
          <View className="loading-spinner"></View>
          <Text className="loading-text">正在生成知识卡片...</Text>
          <Text className="loading-hint">请稍候</Text>
        </View>
      </View>
    )
  }

  if (error || !imageUrl) {
    return (
      <View className="result-page">
        <View className="error-container">
          <Text className="error-text">{error || '未获取到图片'}</Text>
          <Button className="btn-primary" onClick={handleGoBack}>
            返回重试
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className="result-page">
      <View className="result-header">
        <Text className="result-title">知识卡片</Text>
      </View>
      
      <View className="result-content">
        <View className="image-container">
          <Image 
            className="result-image" 
            src={imageUrl}
            mode="widthFix"
            showMenuByLongpress
          />
        </View>
      </View>

      <View className="result-footer">
        <Button className="btn-secondary" onClick={handleGoBack}>
          返回首页
        </Button>
        <Button className="btn-primary" onClick={handleSave}>
          保存到相册
        </Button>
      </View>
    </View>
  )
}
