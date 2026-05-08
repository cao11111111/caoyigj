import { View, Text, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { X } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.config'

interface LoginModalProps {
  show: boolean
  onClose: () => void
}

export default function LoginModal({ show, onClose }: LoginModalProps) {
  const [loginType, setLoginType] = useState<'account' | 'wechat'>('account')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [tempToken, setTempToken] = useState('')

  useEffect(() => {
    if (!show) {
      setUsername('')
      setPassword('')
      setVerifyCode('')
      setShowVerify(false)
      setTempToken('')
    }
  }, [show])

  const handleAccountLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Taro.showToast({ title: '请输入账号和密码', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/auth/login',
        method: 'POST',
        data: { username: username.trim(), password: password.trim() }
      })
      console.log('登录响应:', res.data)
      
      if (res.data?.code === 200) {
        if (res.data.data?.needVerify) {
          setTempToken(res.data.data.tempToken)
          setShowVerify(true)
        } else {
          Taro.setStorageSync('token', res.data.data.token)
          Taro.setStorageSync('userId', res.data.data.userId)
          onClose()
          Taro.reLaunch({ url: '/pages/index/index' })
        }
      } else {
        Taro.showToast({ title: res.data?.msg || '登录失败', icon: 'none' })
      }
    } catch (e) {
      console.error('登录错误:', e)
      Taro.showToast({ title: '网络错误', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleWechatLogin = async () => {
    setLoading(true)
    let code = ''
    
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      try {
        const loginRes = await Taro.login()
        code = loginRes.code || ''
      } catch (e) {
        console.error('微信登录失败', e)
        Taro.showToast({ title: '微信登录失败', icon: 'none' })
        setLoading(false)
        return
      }
    } else {
      code = 'h5_demo_code_' + Date.now()
    }

    try {
      const res = await Network.request({
        url: '/api/auth/wechat-login',
        method: 'POST',
        data: { code }
      })
      console.log('微信登录响应:', res.data)
      
      if (res.data?.code === 200) {
        if (res.data.data?.needVerify) {
          setTempToken(res.data.data.tempToken)
          setShowVerify(true)
        } else {
          Taro.setStorageSync('token', res.data.data.token)
          Taro.setStorageSync('userId', res.data.data.userId)
          onClose()
          Taro.reLaunch({ url: '/pages/index/index' })
        }
      } else {
        Taro.showToast({ title: res.data?.msg || '登录失败', icon: 'none' })
      }
    } catch (e) {
      console.error('登录错误:', e)
      Taro.showToast({ title: '网络错误', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verifyCode.trim()) {
      Taro.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/auth/verify',
        method: 'POST',
        data: { tempToken, verifyCode: verifyCode.trim() }
      })
      console.log('验证响应:', res.data)
      
      if (res.data?.code === 200) {
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userId', res.data.data.userId)
        Taro.setStorageSync('needProfile', true)
        onClose()
        Taro.reLaunch({ url: '/pages/login/profile' })
      } else {
        Taro.showToast({ title: res.data?.msg || '验证失败', icon: 'none' })
      }
    } catch (e) {
      console.error('验证错误:', e)
      Taro.showToast({ title: '网络错误', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* 遮罩层 */}
      <View className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* 弹窗内容 */}
      <View className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        {/* 关闭按钮 */}
        <View className="absolute top-4 right-4" onClick={onClose}>
          <X size={20} color="#64748B" />
        </View>

        {/* 标题 */}
        <Text className="block text-center text-xl font-bold text-slate-800 mb-6">
          登录曹一工具箱
        </Text>

        {!showVerify ? (
          <>
            {/* 登录方式切换 */}
            <View className="flex bg-slate-100 rounded-xl p-1 mb-6">
              <View
                className={`flex-1 py-2 rounded-lg text-center text-sm font-medium transition-all ${loginType === 'account' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}
                onClick={() => setLoginType('account')}
              >
                账号登录
              </View>
              <View
                className={`flex-1 py-2 rounded-lg text-center text-sm font-medium transition-all ${loginType === 'wechat' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}
                onClick={() => setLoginType('wechat')}
              >
                微信登录
              </View>
            </View>

            {loginType === 'account' ? (
              <View className="space-y-4">
                <View>
                  <Text className="block text-sm text-slate-600 mb-2">账号</Text>
                  <View className="bg-slate-50 rounded-xl px-4 py-3">
                    <Input
                      className="w-full text-slate-800"
                      placeholder="请输入账号"
                      value={username}
                      onInput={(e) => setUsername(e.detail.value)}
                    />
                  </View>
                </View>
                <View>
                  <Text className="block text-sm text-slate-600 mb-2">密码</Text>
                  <View className="bg-slate-50 rounded-xl px-4 py-3">
                    <Input
                      className="w-full text-slate-800"
                      placeholder="请输入密码"
                      value={password}
                      onInput={(e) => setPassword(e.detail.value)}
                    />
                  </View>
                </View>
                <View 
                  className={`mt-2 py-3 rounded-xl text-center font-medium ${loading ? 'bg-slate-300 text-slate-500' : 'bg-blue-500 text-white'}`}
                  onClick={loading ? undefined : handleAccountLogin}
                >
                  {loading ? '登录中...' : '登录'}
                </View>
              </View>
            ) : (
              <View className="py-4">
                <View 
                  className="bg-green-500 rounded-xl p-4 flex items-center justify-center"
                  onClick={!loading ? handleWechatLogin : undefined}
                >
                  {loading ? (
                    <Text className="text-white font-medium">登录中...</Text>
                  ) : (
                    <View className="flex items-center">
                      <Text className="text-xl mr-3">微信</Text>
                      <Text className="text-white font-medium">点击此处一键登录</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* 底部提示 */}
            <Text className="block text-center text-xs text-slate-400 mt-6">
              登录即表示同意《用户协议》和《隐私政策》
            </Text>
          </>
        ) : (
          <View className="py-4">
            <Text className="block text-center text-slate-600 mb-4">
              请输入验证码（演示码：123456）
            </Text>
            <View className="bg-slate-50 rounded-xl px-4 py-3 mb-4">
              <Input
                className="w-full text-slate-800 text-center text-lg tracking-widest"
                placeholder="请输入验证码"
                maxlength={6}
                value={verifyCode}
                onInput={(e) => setVerifyCode(e.detail.value)}
              />
            </View>
            <View 
              className={`py-3 rounded-xl text-center font-medium ${loading ? 'bg-slate-300 text-slate-500' : 'bg-blue-500 text-white'}`}
              onClick={loading ? undefined : handleVerify}
            >
              {loading ? '验证中...' : '验证'}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
