import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
      
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        const loginRes = await Taro.login()
        code = loginRes.code || ''
      } else {
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
    setUsername('')
    setPassword('')
  }

  const closeLogin = () => {
    setShowLogin(false)
    setError('')
  }

  return (
    <View className="min-h-screen bg-white flex flex-col relative">
      {/* 主内容区 */}
      <View className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <Image
          src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2Fimage_20260508134139958.png&nonce=84090862-c7c5-4df3-af6d-5926c79363f4&project_id=7636683216082026538&sign=4b2e30ec79e23c89ce719c0dd6692ea6aa4876af8d9ddba9bebf4a6051195f8f"
          className="w-24 h-24 rounded-full mb-6"
          mode="aspectFill"
        />
        
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

      {/* 登录弹窗 - 简化版 */}
      {showLogin && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <View className="bg-white rounded-xl w-full max-w-sm p-6">
            <View className="flex justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                {loginType === 'account' ? '账号登录' : '微信登录'}
              </Text>
              <View 
                className="w-8 h-8 flex items-center justify-center"
                onClick={closeLogin}
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
                  {error && (
                    <Text className="text-red-500 text-sm text-center">{error}</Text>
                  )}
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
                  {error && (
                    <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
                  )}
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
                {error && (
                  <Text className="text-red-500 text-sm text-center">{error}</Text>
                )}
                <Button
                  onClick={handleVerify}
                  className="w-full bg-blue-500 text-white h-12 rounded-full mt-2"
                >
                  <Text className="text-base font-medium">
                    {loading ? '验证中...' : '验证'}
                  </Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  )
}
