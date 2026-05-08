import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import Taro from '@tarojs/taro'
import { Network } from '@/network'

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [loginType, setLoginType] = useState<'account' | 'wechat'>('account')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [needVerify, setNeedVerify] = useState(false)
  const [tempToken, setTempToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAccountLogin = async () => {
    if (!username || !password) {
      setError('请输入账号和密码')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await Network.request({
        url: '/api/auth/login',
        method: 'POST',
        data: { username, password }
      })
      console.log('登录响应:', res.data)
      
      if (res.data.code === 200) {
        if (res.data.data.needVerify) {
          setTempToken(res.data.data.tempToken)
          setNeedVerify(true)
        } else {
          Taro.setStorageSync('token', res.data.data.token)
          Taro.setStorageSync('userInfo', res.data.data.userInfo)
          Taro.switchTab({ url: '/pages/index/index' })
        }
      } else {
        setError(res.data.msg || '登录失败')
      }
    } catch (e: any) {
      setError(e.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleWechatLogin = async () => {
    setLoading(true)
    setError('')
    try {
      let code = ''
      
      // 微信小程序环境
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        const loginRes = await Taro.login()
        code = loginRes.code || ''
      } else {
        // H5 降级：使用模拟 code
        code = 'h5_mock_code_' + Date.now()
      }

      const res = await Network.request({
        url: '/api/auth/wechat-login',
        method: 'POST',
        data: { code }
      })
      console.log('微信登录响应:', res.data)
      
      if (res.data.code === 200) {
        if (res.data.data.needVerify) {
          setTempToken(res.data.data.tempToken)
          setNeedVerify(true)
        } else {
          Taro.setStorageSync('token', res.data.data.token)
          Taro.setStorageSync('userInfo', res.data.data.userInfo)
          Taro.switchTab({ url: '/pages/index/index' })
        }
      } else {
        setError(res.data.msg || '登录失败')
      }
    } catch (e: any) {
      setError(e.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verifyCode) {
      setError('请输入验证码')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await Network.request({
        url: '/api/auth/verify',
        method: 'POST',
        data: { tempToken, verifyCode }
      })
      console.log('验证响应:', res.data)
      
      if (res.data.code === 200) {
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userInfo', res.data.data.userInfo)
        Taro.switchTab({ url: '/pages/index/index' })
      } else {
        setError(res.data.msg || '验证失败')
      }
    } catch (e: any) {
      setError(e.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  const openLogin = (type: 'account' | 'wechat') => {
    setLoginType(type)
    setShowLogin(true)
    setError('')
    setVerifyCode('')
    setNeedVerify(false)
  }

  return (
    <View className="min-h-screen bg-white flex flex-col">
      {/* 主内容区 */}
      <View className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <View className="w-24 h-24 rounded-3xl bg-blue-500 flex items-center justify-center mb-6">
          <Text className="text text-4xl text-white font-bold">曹</Text>
        </View>
        
        {/* 标题 */}
        <Text className="text-3xl font-bold text-gray-800">曹一工具箱</Text>
      </View>

      {/* 底部登录方式 */}
      <View className="px-6 pb-12">
        <View className="space-y-3">
          <Button
            onClick={() => openLogin('account')}
            className="w-full bg-blue-500 text-white h-12 rounded-full"
          >
            <Text className="text-base font-medium">账号登录</Text>
          </Button>
          
          <Button
            onClick={() => openLogin('wechat')}
            className="w-full bg-green-500 text-white h-12 rounded-full"
          >
            <Text className="text-base font-medium">微信登录</Text>
          </Button>
        </View>
        
        <Text className="block text-center text-xs text-gray-400 mt-6">
          登录即表示同意《用户协议》和《隐私政策》
        </Text>
      </View>

      {/* 登录弹窗 */}
      <Dialog open={showLogin} onOpenChange={(open) => setShowLogin(open)}>
        <View className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 遮罩 */}
          <View 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setShowLogin(false)}
          />
          
          {/* 弹窗内容 */}
          <View className="relative bg-white rounded-2xl w-full max-w-sm p-6">
            <View className="flex justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                {loginType === 'account' ? '账号登录' : '微信登录'}
              </Text>
              <View 
                className="w-8 h-8 flex items-center justify-center"
                onClick={() => setShowLogin(false)}
              >
                <Text className="text-gray-400 text-xl">✕</Text>
              </View>
            </View>

            {!needVerify ? (
              loginType === 'account' ? (
                <View className="space-y-4">
                  <View className="bg-gray-50 rounded-xl px-4 py-3">
                    <Input
                      className="w-full"
                      placeholder="请输入账号"
                      value={username}
                      onInput={(e: any) => setUsername(e.target.value)}
                    />
                  </View>
                  <View className="bg-gray-50 rounded-xl px-4 py-3">
                    <Input
                      className="w-full"
                      placeholder="请输入密码"
                      value={password}
                      onInput={(e: any) => setPassword(e.target.value)}
                    />
                  </View>
                  <Button
                    onClick={handleAccountLogin}
                    className="w-full bg-blue-500 text-white h-12 rounded-full mt-2"
                  >
                    <Text className="text-base font-medium">
                      {loading ? '登录中...' : '登录'}
                    </Text>
                  </Button>
                </View>
              ) : (
                <View className="text-center py-4">
                  <Text className="block text-gray-600 mb-4">
                    即将唤起微信授权
                  </Text>
                  <Button
                    onClick={handleWechatLogin}
                    className="w-full bg-green-500 text-white h-12 rounded-full"
                  >
                    <Text className="text-base font-medium">
                      {loading ? '登录中...' : '确认登录'}
                    </Text>
                  </Button>
                </View>
              )
            ) : (
              <View className="space-y-4">
                <Text className="block text-center text-sm text-gray-500">
                  请输入验证码完成验证（演示验证码：123456）
                </Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    className="w-full text-center text-lg"
                    placeholder="请输入验证码"
                    value={verifyCode}
                    onInput={(e: any) => setVerifyCode(e.target.value)}
                    maxlength={6}
                  />
                </View>
                <Button
                  onClick={handleVerify}
                  className="w-full bg-blue-500 text-white h-12 rounded-full mt-2"
                >
                  <Text className="text-base font-medium">
                    {loading ? '验证中...' : '确认'}
                  </Text>
                </Button>
              </View>
            )}

            {error && (
              <Text className="block text-red-500 text-sm text-center mt-4">
                {error}
              </Text>
            )}
          </View>
        </View>
      </Dialog>
    </View>
  )
}
