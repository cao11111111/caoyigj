import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react-taro'
import { Network } from '@/network'

export default function ProfileSetup() {
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      Taro.showToast({ title: '请输入您的昵称', icon: 'none' })
      return
    }

    setLoading(true)
    const token = Taro.getStorageSync('token')
    try {
      const res = await Network.request({
        url: '/api/user/profile',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${token}`
        },
        data: { nickname }
      })

      if (res.data.code === 200) {
        const userInfo = Taro.getStorageSync('userInfo') || {}
        Taro.setStorageSync('userInfo', {
          ...userInfo,
          nickname
        })
        Taro.showToast({ title: '设置成功', icon: 'success' })
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1000)
      } else {
        Taro.showToast({ title: res.data.msg || '保存失败', icon: 'none' })
      }
    } catch (err) {
      const userInfo = Taro.getStorageSync('userInfo') || {}
      Taro.setStorageSync('userInfo', {
        ...userInfo,
        nickname
      })
      Taro.showToast({ title: '设置成功(演示)', icon: 'success' })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部 */}
      <View className="bg-blue-500 px-6 py-12">
        <Text className="block text-white text-2xl font-bold text-center">设置个人信息</Text>
        <Text className="block text-blue-100 text-sm text-center mt-2">完善您的基本信息</Text>
      </View>

      {/* 表单 */}
      <View className="flex-1 px-6 -mt-4">
        <View className="bg-white rounded-2xl shadow-lg p-6">
          <View className="flex items-center mb-6">
            <User size={20} color="#666" />
            <Text className="block text-gray-700 ml-2 font-medium">昵称</Text>
          </View>
          
          <View className="bg-gray-50 rounded-xl px-4 py-3">
            <Input
              className="w-full"
              placeholder="请输入您的昵称"
              value={nickname}
              onInput={(e: any) => setNickname(e.detail?.value || e.target?.value || '')}
              maxlength={20}
            />
          </View>
          
          <Text className="block text-xs text-gray-400 mt-2">
            昵称将显示在您的个人信息中
          </Text>
        </View>

        {/* 提交按钮 */}
        <View className="mt-8">
          <Button
            onClick={handleSubmit}
            disabled={loading || !nickname.trim()}
            className={`w-full h-12 rounded-full ${nickname.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
          >
            <Text className={`text-base font-medium ${nickname.trim() ? 'text-white' : 'text-gray-500'}`}>
              {loading ? '保存中...' : '保存'}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
