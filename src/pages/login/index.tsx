import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, User, Lock, MessageCircleCode } from 'lucide-react-taro'
import { Network } from '@/network'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [tempToken, setTempToken] = useState('')
  const [loginType, setLoginType] = useState<'account' | 'wechat'>('account')

  // 微信一键登录
  const handleWechatLogin = async () => {
    // 检查是否支持微信登录
    const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP
    
    if (!isWeapp) {
      Taro.showToast({ title: '微信登录仅支持小程序端', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      // 小程序端：使用 wx.login 获取 code
      const loginRes = await new Promise<{ code: string }>((resolve, reject) => {
        Taro.login({
          success: (res) => {
            if (res.code) {
              resolve({ code: res.code })
            } else {
              reject(new Error('未获取到 code'))
            }
          },
          fail: reject
        })
      })

      console.log('微信登录 code:', loginRes.code)

      // 调用后端接口
      const res = await Network.request({
        url: '/api/auth/wechat-login',
        method: 'POST',
        data: { code: loginRes.code }
      })
      
      console.log('微信登录响应:', res.data)

      if (res.data.code === 200) {
        const data = res.data.data
        
        if (data.needVerify) {
          // 新用户需要验证
          setTempToken(data.tempToken)
          setShowVerify(true)
        } else {
          // 老用户直接登录
          Taro.setStorageSync('token', data.token)
          Taro.setStorageSync('userInfo', data.user)
          Taro.showToast({ title: '登录成功', icon: 'success' })
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/index/index' })
          }, 1000)
        }
      } else {
        Taro.showToast({ title: res.data.msg || '登录失败', icon: 'none' })
      }
    } catch (err) {
      console.error('微信登录失败:', err)
      Taro.showToast({ title: '微信登录失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  // 账号密码登录
  const handleAccountLogin = async () => {
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
        const data = res.data.data
        
        if (data.needVerify) {
          // 新用户需要验证
          setTempToken(data.tempToken)
          setShowVerify(true)
        } else {
          Taro.setStorageSync('token', data.token)
          Taro.setStorageSync('userInfo', data.user)
          Taro.showToast({ title: '登录成功', icon: 'success' })
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/index/index' })
          }, 1000)
        }
      } else {
        Taro.showToast({ title: res.data.msg || '登录失败', icon: 'none' })
      }
    } catch (err) {
      console.error('登录失败:', err)
      // 演示模式
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

  // 验证验证码
  const handleVerify = async () => {
    if (verifyCode.trim() !== '123456') {
      Taro.showToast({ title: '验证码错误', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/auth/verify',
        method: 'POST',
        data: { tempToken: tempToken, verifyCode: verifyCode }
      })
      
      if (res.data.code === 200) {
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userInfo', res.data.data.user)
        Taro.showToast({ title: '验证成功', icon: 'success' })
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1000)
      } else {
        Taro.showToast({ title: res.data.msg || '验证失败', icon: 'none' })
      }
    } catch (err) {
      console.error('验证失败:', err)
      // 演示模式
      Taro.setStorageSync('token', 'mock-token')
      Taro.setStorageSync('userInfo', { username: '新用户' })
      Taro.showToast({ title: '验证成功(演示)', icon: 'success' })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  // 切换登录方式
  const toggleLoginType = (type: 'account' | 'wechat') => {
    setLoginType(type)
    setUsername('')
    setPassword('')
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

      {/* 验证码弹窗 */}
      {showVerify ? (
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <View className="text-center mb-6">
              <MessageCircleCode size={48} color="#2563eb" className="mx-auto mb-4" />
              <Text className="block text-lg font-semibold text-gray-800 mb-2">新用户验证</Text>
              <Text className="block text-sm text-gray-500">请输入管理员提供的验证码</Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-2">验证码</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    className="w-full text-center text-xl tracking-widest"
                    placeholder="请输入验证码"
                    value={verifyCode}
                    maxlength={6}
                    onInput={(e) => setVerifyCode(e.detail.value)}
                  />
                </View>
              </View>

              <Button
                className="w-full bg-blue-500 text-white rounded-xl py-3"
                onClick={handleVerify}
                disabled={loading || verifyCode.length < 6}
              >
                <Text className="text-base font-medium text-white">
                  {loading ? '验证中...' : '确认'}
                </Text>
              </Button>

              <View className="text-center">
                <Text
                  className="block text-sm text-blue-500"
                  onClick={() => setShowVerify(false)}
                >
                  返回登录
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 登录方式切换 */}
          <View className="flex gap-4 mb-6">
            <View
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                loginType === 'account'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => toggleLoginType('account')}
            >
              <Text className={loginType === 'account' ? 'text-white' : 'text-gray-600'}>账号登录</Text>
            </View>
            <View
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                loginType === 'wechat'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => toggleLoginType('wechat')}
            >
              <Text className={loginType === 'wechat' ? 'text-white' : 'text-gray-600'}>微信登录</Text>
            </View>
          </View>

          {loginType === 'account' ? (
            /* 账号登录表单 */
            <Card className="w-full max-w-sm">
              <CardContent className="p-6">
                <View className="space-y-4">
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

                  <Button
                    className="w-full bg-blue-500 text-white rounded-xl py-3"
                    onClick={handleAccountLogin}
                    disabled={loading}
                  >
                    <Text className="text-base font-medium text-white">
                      {loading ? '登录中...' : '登录'}
                    </Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          ) : (
            /* 微信一键登录 */
            <Card className="w-full max-w-sm">
              <CardContent className="p-6">
                <View className="text-center space-y-6">
                  <View className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                    <Text className="text-3xl">V</Text>
                  </View>
                  <View>
                    <Text className="block text-lg font-semibold text-gray-800 mb-2">微信一键登录</Text>
                    <Text className="block text-sm text-gray-500">使用微信快速登录您的账号</Text>
                  </View>
                  <Button
                    className="w-full bg-green-500 text-white rounded-xl py-3"
                    onClick={handleWechatLogin}
                    disabled={loading}
                  >
                    <Text className="text-base font-medium text-white">
                      {loading ? '登录中...' : '微信授权登录'}
                    </Text>
                  </Button>
                  <Text className="block text-xs text-gray-400">
                    登录即表示同意《用户协议》和《隐私政策》
                  </Text>
                </View>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* 底部说明 */}
      {!showVerify && loginType === 'account' && (
        <View className="mt-8">
          <Text className="block text-xs text-gray-400 text-center">
            登录即表示同意《用户协议》和《隐私政策》
          </Text>
        </View>
      )}
    </View>
  )
}
