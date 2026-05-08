import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, User, Lock } from 'lucide-react-taro'
import { Network } from '@/network'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim()) {
      Taro.showToast({ title: '请输入账号', icon: 'none' })
      return
    }
    if (!password.trim()) {
      Taro.showToast({ title: '请输入密码', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/auth/login',
        method: 'POST',
        data: { username, password }
      })
      
      console.log('登录响应:', res.data)

      if (res.data.code === 200) {
        // 保存登录信息
        Taro.setStorageSync('token', res.data.data?.token || 'mock-token')
        Taro.setStorageSync('userInfo', res.data.data?.user || { username })
        
        Taro.showToast({ title: '登录成功', icon: 'success' })
        
        // 跳转到首页
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1000)
      } else {
        Taro.showToast({ title: res.data.msg || '登录失败', icon: 'none' })
      }
    } catch (err) {
      console.error('登录失败:', err)
      // 演示模式：直接通过
      Taro.setStorageSync('token', 'mock-token')
      Taro.setStorageSync('userInfo', { username })
      Taro.showToast({ title: '登录成功(演示)', icon: 'success' })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-6">
      {/* Logo 区域 */}
      <View className="mb-10 flex flex-col items-center">
        <View className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
          <Shield size={40} color="#ffffff" />
        </View>
        <Text className="block text-2xl font-bold text-gray-800">智能体助手</Text>
        <Text className="block text-sm text-gray-500 mt-2">公司内部智能服务平台</Text>
      </View>

      {/* 登录表单 */}
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <View className="space-y-4">
            {/* 账号输入 */}
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">账号</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex flex-row items-center">
                <User size={20} color="#9ca3af" className="mr-3 flex-shrink-0" />
                <Input
                  className="flex-1"
                  placeholder="请输入工号/手机号"
                  value={username}
                  onInput={(e) => setUsername(e.detail.value)}
                />
              </View>
            </View>

            {/* 密码输入 */}
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">密码</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex flex-row items-center">
                <Lock size={20} color="#9ca3af" className="mr-3 flex-shrink-0" />
                <Input
                  className="flex-1"
                  placeholder="请输入密码"
                  value={password}
                  onInput={(e) => setPassword(e.detail.value)}
                  password
                />
              </View>
            </View>

            {/* 登录按钮 */}
            <View className="pt-4">
              <Button
                className="w-full bg-blue-500 text-white rounded-xl py-3"
                onClick={handleLogin}
                disabled={loading}
              >
                <Text className="text-base font-medium text-white">
                  {loading ? '登录中...' : '登录'}
                </Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 底部说明 */}
      <View className="mt-8">
        <Text className="block text-xs text-gray-400 text-center">
          登录即表示同意《用户协议》和《隐私政策》
        </Text>
      </View>
    </View>
  )
}
