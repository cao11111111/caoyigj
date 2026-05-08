import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Taro from '@tarojs/taro'
import { Network } from '@/network'

export default function LoginPage() {
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
          Taro.setStorageSync('userInfo', res.data.data.user)
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
      // 小程序端使用 wx.login
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        const loginRes = await Taro.login()
        if (!loginRes.code) {
          throw new Error('获取微信授权失败')
        }
        const res = await Network.request({
          url: '/api/auth/wechat-login',
          method: 'POST',
          data: { code: loginRes.code }
        })
        
        if (res.data.code === 200) {
          if (res.data.data.needVerify) {
            setTempToken(res.data.data.tempToken)
            setNeedVerify(true)
            setLoginType('account')
          } else {
            Taro.setStorageSync('token', res.data.data.token)
            Taro.setStorageSync('userInfo', res.data.data.user)
            Taro.switchTab({ url: '/pages/index/index' })
          }
        } else {
          setError(res.data.msg || '登录失败')
        }
      } else {
        // H5端演示模式
        const mockCode = 'h5_demo_' + Date.now()
        const res = await Network.request({
          url: '/api/auth/wechat-login',
          method: 'POST',
          data: { code: mockCode }
        })
        
        if (res.data.code === 200) {
          if (res.data.data.needVerify) {
            setTempToken(res.data.data.tempToken)
            setNeedVerify(true)
            setLoginType('account')
          } else {
            Taro.setStorageSync('token', res.data.data.token)
            Taro.setStorageSync('userInfo', res.data.data.user)
            Taro.switchTab({ url: '/pages/index/index' })
          }
        } else {
          setError(res.data.msg || '登录失败')
        }
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

  return (
    <View style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* 顶部区域 */}
      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '80px', paddingBottom: '40px' }}>
        {/* Logo */}
        <Image
          src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2Fimage_20260508134139958.png&nonce=84090862-c7c5-4df3-af6d-5926c79363f4&project_id=7636683216082026538&sign=4b2e30ec79e23c89ce719c0dd6692ea6aa4876af8d9ddba9bebf4a6051195f8f"
          style={{ width: '96px', height: '96px', borderRadius: '48px', marginBottom: '24px' }}
          mode="aspectFill"
        />
        
        {/* 标题 */}
        <Text style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>曹一工具箱</Text>
      </View>

      {/* 登录表单区域 */}
      <View style={{ padding: '0 24px' }}>
        {/* 登录方式切换 */}
        {!needVerify && (
          <View style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
            <View 
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '8px', 
                textAlign: 'center',
                backgroundColor: loginType === 'account' ? '#2563eb' : 'transparent',
              }}
              onClick={() => setLoginType('account')}
            >
              <Text style={{ 
                color: loginType === 'account' ? '#ffffff' : '#6b7280',
                fontSize: '16px',
                fontWeight: loginType === 'account' ? '600' : '400'
              }}>账号登录</Text>
            </View>
            <View 
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '8px', 
                textAlign: 'center',
                backgroundColor: loginType === 'wechat' ? '#2563eb' : 'transparent',
              }}
              onClick={() => setLoginType('wechat')}
            >
              <Text style={{ 
                color: loginType === 'wechat' ? '#ffffff' : '#6b7280',
                fontSize: '16px',
                fontWeight: loginType === 'wechat' ? '600' : '400'
              }}>微信登录</Text>
            </View>
          </View>
        )}

        {/* 验证码表单 */}
        {needVerify ? (
          <View>
            <View style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <Input
                style={{ width: '100%', fontSize: '18px', textAlign: 'center' }}
                placeholder="请输入验证码"
                value={verifyCode}
                onInput={(e: any) => setVerifyCode(e.target.value)}
                maxlength={6}
              />
            </View>
            <Text style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginBottom: '16px' }}>
              演示验证码：123456
            </Text>
            {error ? (
              <Text style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>{error}</Text>
            ) : null}
            <Button
              onClick={handleVerify}
              style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', height: '48px', borderRadius: '24px' }}
            >
              <Text style={{ fontSize: '16px', fontWeight: '500' }}>
                {loading ? '验证中...' : '验证'}
              </Text>
            </Button>
          </View>
        ) : loginType === 'account' ? (
          /* 账号登录表单 */
          <View>
            <View style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <Input
                style={{ width: '100%', fontSize: '16px' }}
                placeholder="请输入账号"
                value={username}
                onInput={(e: any) => setUsername(e.target.value)}
              />
            </View>
            <View style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <Input
                style={{ width: '100%', fontSize: '16px' }}
                placeholder="请输入密码"
                value={password}
                onInput={(e: any) => setPassword(e.target.value)}
                password
              />
            </View>
            {error ? (
              <Text style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>{error}</Text>
            ) : null}
            <Button
              onClick={handleAccountLogin}
              style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', height: '48px', borderRadius: '24px' }}
            >
              <Text style={{ fontSize: '16px', fontWeight: '500' }}>
                {loading ? '登录中...' : '登录'}
              </Text>
            </Button>
          </View>
        ) : (
          /* 微信登录表单 */
          <View style={{ textAlign: 'center', paddingTop: '40px' }}>
            <View style={{ marginBottom: '24px' }}>
              <Text style={{ fontSize: '32px' }}>👆</Text>
            </View>
            <Text style={{ fontSize: '16px', color: '#374151', marginBottom: '8px', display: 'block' }}>
              点击下方按钮进行微信授权登录
            </Text>
            <Text style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px', display: 'block' }}>
              新用户需验证手机号
            </Text>
            {error ? (
              <Text style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>{error}</Text>
            ) : null}
            <Button
              onClick={handleWechatLogin}
              style={{ width: '100%', backgroundColor: '#22c55e', color: '#ffffff', height: '48px', borderRadius: '24px' }}
            >
              <Text style={{ fontSize: '16px', fontWeight: '500' }}>
                {loading ? '登录中...' : '微信登录'}
              </Text>
            </Button>
          </View>
        )}
      </View>

      {/* 底部协议 */}
      <View style={{ position: 'fixed', bottom: '40px', left: 0, right: 0, padding: '0 24px' }}>
        <Text style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', display: 'block' }}>
          登录即表示同意《用户协议》和《隐私政策》
        </Text>
      </View>
    </View>
  )
}
