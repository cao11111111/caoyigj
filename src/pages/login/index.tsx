import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
    const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP
    const isH5 = Taro.getEnv() === Taro.ENV_TYPE.WEB
    
    if (isH5) {
      setLoading(true)
      try {
        const mockCode = 'h5_mock_code_' + Date.now()
        const res = await Network.request({
          url: '/api/auth/wechat-login',
          method: 'POST',
          data: { code: mockCode }
        })
        
        if (res.data.code === 200) {
          const data = res.data.data
          if (data.needVerify) {
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
        Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
      } finally {
        setLoading(false)
      }
      return
    }

    if (!isWeapp) {
      Taro.showToast({ title: '请在微信小程序中使用微信登录', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const loginRes = await new Promise<{ code: string }>((resolve, reject) => {
        Taro.login({
          success: (res) => {
            if (res.code) resolve({ code: res.code })
            else reject(new Error('未获取到 code'))
          },
          fail: reject
        })
      })

      const res = await Network.request({
        url: '/api/auth/wechat-login',
        method: 'POST',
        data: { code: loginRes.code }
      })

      if (res.data.code === 200) {
        const data = res.data.data
        if (data.needVerify) {
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

      if (res.data.code === 200) {
        const data = res.data.data
        if (data.needVerify) {
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
      Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
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
        data: { tempToken, verifyCode }
      })
      
      if (res.data.code === 200) {
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userInfo', res.data.data.user)
        Taro.showToast({ title: '验证成功', icon: 'success' })
        setTimeout(() => {
          Taro.redirectTo({ url: '/pages/login/profile' })
        }, 1000)
      } else {
        Taro.showToast({ title: res.data.msg || '验证失败', icon: 'none' })
      }
    } catch (err) {
      Taro.showToast({ title: '验证失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* 顶部背景 */}
      <View className="h-56 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 relative overflow-hidden">
        {/* 装饰圆形 */}
        <View className="absolute top-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full" />
        <View className="absolute bottom-5 left-5 w-20 h-20 bg-white opacity-10 rounded-full" />
        
        {/* Logo 和标题 */}
        <View className="flex flex-col items-center justify-center h-full">
          <View className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <MessageCircleCode size={48} color="#2563EB" />
          </View>
          <Text className="text-white text-2xl font-bold">曹一工具箱</Text>
          <Text className="text-blue-100 text-sm mt-1">校园智能工具助手</Text>
        </View>
      </View>

      {/* 登录表单 */}
      <View className="flex-1 px-6 -mt-6">
        <View className="bg-white rounded-2xl shadow-lg p-6">
          {/* Tab 切换 */}
          <View className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <View 
              className={`flex-1 py-3 rounded-lg text-center text-sm font-medium transition-all ${loginType === 'account' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
              onClick={() => setLoginType('account')}
            >
              账号登录
            </View>
            <View 
              className={`flex-1 py-3 rounded-lg text-center text-sm font-medium transition-all ${loginType === 'wechat' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
              onClick={() => setLoginType('wechat')}
            >
              微信登录
            </View>
          </View>

          {loginType === 'account' ? (
            <>
              {/* 账号密码输入 */}
              <View className="space-y-4">
                <View>
                  <Text className="block text-gray-600 text-sm mb-2">账号</Text>
                  <View className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                    <User size={18} color="#94A3B8" />
                    <Input
                      className="flex-1 ml-3 text-base"
                      placeholder="请输入账号"
                      value={username}
                      onInput={(e) => setUsername(e.detail.value)}
                    />
                  </View>
                </View>
                <View>
                  <Text className="block text-gray-600 text-sm mb-2">密码</Text>
                  <View className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                    <Lock size={18} color="#94A3B8" />
                    <Input
                      className="flex-1 ml-3 text-base"
                      password
                      placeholder="请输入密码"
                      value={password}
                      onInput={(e) => setPassword(e.detail.value)}
                    />
                  </View>
                </View>
              </View>

              <Button
                className="w-full mt-6 bg-blue-500 text-white py-4 rounded-xl text-base font-medium shadow-md shadow-blue-200"
                onClick={handleAccountLogin}
                disabled={loading}
              >
                <Text className={loading ? 'opacity-70' : ''}>{loading ? '登录中...' : '登录'}</Text>
              </Button>
            </>
          ) : (
            <>
              <View className="text-center py-4">
                <View className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Text className="text-white text-2xl">微</Text>
                </View>
                <Text className="block text-gray-700 font-medium mb-1">微信一键登录</Text>
                <Text className="block text-gray-400 text-sm">点击下方按钮快速登录</Text>
              </View>

              <Button
                className="w-full mt-4 bg-green-500 text-white py-4 rounded-xl text-base font-medium shadow-md shadow-green-200"
                onClick={handleWechatLogin}
                disabled={loading}
              >
                <Text className={loading ? 'opacity-70' : ''}>{loading ? '登录中...' : '微信登录'}</Text>
              </Button>
            </>
          )}

          {/* 验证码弹窗 */}
          {showVerify && (
            <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
              <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                <View className="text-center mb-4">
                  <View className="w-14 h-14 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield size={28} color="#2563EB" />
                  </View>
                  <Text className="block text-lg font-semibold text-gray-800">安全验证</Text>
                  <Text className="block text-gray-400 text-sm mt-1">请输入验证码完成验证</Text>
                </View>
                
                <View className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 mb-4">
                  <Input
                    className="flex-1 text-base text-center"
                    type="number"
                    placeholder="请输入验证码"
                    maxlength={6}
                    value={verifyCode}
                    onInput={(e) => setVerifyCode(e.detail.value)}
                  />
                </View>
                <Text className="block text-gray-400 text-sm text-center mb-4">验证码：123456</Text>

                <View className="flex gap-3">
                  <Button
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600"
                    onClick={() => setShowVerify(false)}
                  >
                    取消
                  </Button>
                  <Button
                    className="flex-1 py-3 rounded-xl bg-blue-500 text-white"
                    onClick={handleVerify}
                    disabled={loading}
                  >
                    <Text className={loading ? 'opacity-70' : ''}>{loading ? '验证中...' : '确认'}</Text>
                  </Button>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 底部协议 */}
      <View className="p-6 text-center">
        <Text className="text-gray-400 text-xs">
          登录即表示同意《用户协议》和《隐私政策》
        </Text>
      </View>
    </View>
  )
}
