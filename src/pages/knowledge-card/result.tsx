import { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import { ArrowLeft, Download } from 'lucide-react-taro'
import './result.css'

export default function KnowledgeCardResult() {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // 获取传递的数据
    const getData = async () => {
      try {
        // 尝试从 eventChannel 获取（小程序端）
        const eventChannel = Taro.getCurrentInstance().page?.getOpenerEventChannel?.()
        if (eventChannel) {
          const data = await new Promise((resolve) => {
            eventChannel.on('imageData', (res) => resolve(res))
            // 超时处理
            setTimeout(() => resolve(null), 100)
          })
          if (data && (data as any).imageUrl) {
            setImageUrl((data as any).imageUrl)
            setLoading(false)
            return
          }
        }

        // 尝试从 URL 参数获取（H5端）
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

        // 如果都没有，跳转到首页
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

  // 保存图片
  const handleSave = async () => {
    if (!imageUrl) return

    try {
      // 小程序端下载后保存
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        Taro.showLoading({ title: '保存中...' })
        const { tempFilePath } = await Network.downloadFile({ url: imageUrl })
        await Taro.saveImageToPhotosAlbum({ filePath: tempFilePath })
        Taro.hideLoading()
        Taro.showToast({ title: '保存成功', icon: 'success' })
      } else {
        // H5端尝试直接下载
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

  // 返回上一页
  const handleGoBack = () => {
    Taro.navigateBack()
  }

  // 加载中
  if (loading) {
    return (
      <View className="result-page">
        <View className="loading-container">
          <View className="loading-icon">
            <View className="loading-spinner"></View>
          </View>
          <Text className="loading-text">正在生成知识卡片</Text>
          <Text className="loading-hint">请稍候，马上就好</Text>
        </View>
      </View>
    )
  }

  // 错误状态
  if (error || !imageUrl) {
    return (
      <View className="result-page">
        <View className="error-container">
          <View className="error-icon">
            <Text className="text-2xl">!</Text>
          </View>
          <Text className="error-text">{error || '未获取到图片'}</Text>
          <Button className="error-btn" onClick={handleGoBack}>
            返回重试
          </Button>
        </View>
      </View>
    )
  }

  // 成功显示图片
  return (
    <View className="result-page">
      {/* 头部 */}
      <View className="result-header">
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={20} color="#1e40af" onClick={handleGoBack} />
          <Text className="result-title">知识卡片</Text>
        </View>
      </View>

      {/* 图片展示 - 全屏自适应 */}
      <View className="result-content">
        <View className="image-card">
          <View className="image-container">
            <Image
              className="result-image"
              src={imageUrl}
              mode="widthFix"
              style={{ width: '100%' }}
              showMenuByLongpress
            />
          </View>
        </View>
      </View>

      {/* 底部操作 */}
      <View className="result-footer">
        <Button className="footer-btn btn-secondary" onClick={handleGoBack}>
          再试一张
        </Button>
        <Button className="footer-btn btn-primary" onClick={handleSave}>
          <Download size={16} color="#ffffff" style={{ marginRight: '6px' }} />
          保存图片
        </Button>
      </View>
    </View>
  )
}
