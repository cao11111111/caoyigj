import { View, Text, Image, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { X, User, Lock } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.config'

interface LoginModalProps {
  show: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function LoginModal({ show, onClose, onSuccess }: LoginModalProps) {
  const [loginType, setLoginType] = useState<'account' | 'wechat'>('account')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [needVerify, setNeedVerify] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [tempToken, setTempToken] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (show) {
      setUsername('')
      setPassword('')
      setVerifyCode('')
      setTempToken('')
      setNeedVerify(false)
      setError('')
    }
  }, [show])

  const handleAccountLogin = async () => {
    if (!username || !password) {
      setError('请输入账号和密码')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res: any = await Network.request({
        url: '/api/auth/login',
        method: 'POST',
        data: { username, password }
      })
      console.log('登录响应:', res)
      
      if (res.data?.code === 200) {
        if (res.data.data?.needVerify) {
          setTempToken(res.data.data.token || '')
          setNeedVerify(true)
        } else {
          handleLoginSuccess(res.data.data)
        }
      } else {
        setError(res.data?.msg || '登录失败')
      }
    } catch (e: any) {
      console.error('登录错误:', e)
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
      
      if (Taro.getEnv() === 'WEAPP') {
        const loginRes = await Taro.login()
        code = loginRes.code || ''
      } else {
        code = 'h5_demo_' + Date.now()
      }

      const res: any = await Network.request({
        url: '/api/auth/wechat-login',
        method: 'POST',
        data: { code }
      })
      console.log('微信登录响应:', res)

      if (res.data?.code === 200) {
        if (res.data.data?.needVerify) {
          setTempToken(res.data.data.token || '')
          setNeedVerify(true)
        } else {
          handleLoginSuccess(res.data.data)
        }
      } else {
        setError(res.data?.msg || '登录失败')
      }
    } catch (e: any) {
      console.error('微信登录错误:', e)
      setError(e.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setError('请输入6位验证码')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res: any = await Network.request({
        url: '/api/auth/verify',
        method: 'POST',
        data: { tempToken, verifyCode }
      })
      console.log('验证响应:', res)

      if (res.data?.code === 200) {
        handleLoginSuccess(res.data.data)
      } else {
        setError(res.data?.msg || '验证失败')
      }
    } catch (e: any) {
      console.error('验证错误:', e)
      setError(e.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (data: any) => {
    Taro.setStorageSync('token', data.token)
    Taro.setStorageSync('userInfo', data.user)
    setLoading(false)
    onClose()
    if (onSuccess) {
      onSuccess()
    } else {
      Taro.redirectTo({ url: '/pages/login/profile' })
    }
  }

  if (!show) return null

  return (
    <View style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <View style={{
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        position: 'relative',
      }}>
        {/* 关闭按钮 */}
        <View onClick={onClose} style={{
          position: 'absolute',
          top: 12,
          right: 12,
          padding: 8,
        }}>
          <X size={20} color="#64748b" />
        </View>

        {/* 标题 */}
        <Text style={{
          display: 'block',
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: 8,
        }}>
          {needVerify ? '验证手机号' : '登录'}
        </Text>
        <Text style={{
          display: 'block',
          textAlign: 'center',
          fontSize: 14,
          color: '#64748b',
          marginBottom: 24,
        }}>
          {needVerify ? '请输入6位验证码' : '登录后体验完整功能'}
        </Text>

        {needVerify ? (
          /* 验证码输入 */
          <View>
            <View style={{
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 16,
            }}>
              <Input
                type="number"
                placeholder="请输入验证码"
                maxLength={6}
                value={verifyCode}
                onInput={(e: any) => setVerifyCode(e.detail.value)}
                style={{
                  width: '100%',
                  fontSize: 16,
                  textAlign: 'center',
                  letterSpacing: 8,
                }}
              />
            </View>
            <Text style={{
              display: 'block',
              textAlign: 'center',
              fontSize: 12,
              color: '#94a3b8',
              marginBottom: 16,
            }}>
              验证码: 123456
            </Text>
            <Button
              onClick={handleVerify}
              loading={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Text className="text-white">验证</Text>
            </Button>
          </View>
        ) : (
          /* 登录表单 */
          <>
            {/* 切换标签 */}
            <View style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              borderRadius: 8,
              padding: 4,
              marginBottom: 20,
            }}>
              <View
                onClick={() => setLoginType('account')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: 6,
                  backgroundColor: loginType === 'account' ? '#ffffff' : 'transparent',
                  boxShadow: loginType === 'account' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Text style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: 14,
                  color: loginType === 'account' ? '#2563eb' : '#64748b',
                  fontWeight: loginType === 'account' ? '600' : '400',
                }}>
                  账号登录
                </Text>
              </View>
              <View
                onClick={() => setLoginType('wechat')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: 6,
                  backgroundColor: loginType === 'wechat' ? '#ffffff' : 'transparent',
                  boxShadow: loginType === 'wechat' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Text style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: 14,
                  color: loginType === 'wechat' ? '#2563eb' : '#64748b',
                  fontWeight: loginType === 'wechat' ? '600' : '400',
                }}>
                  微信登录
                </Text>
              </View>
            </View>

            {loginType === 'account' ? (
              /* 账号登录表单 */
              <View>
                <View style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <User size={18} color="#64748b" />
                  <Input
                    placeholder="请输入账号"
                    value={username}
                    onInput={(e: any) => setUsername(e.detail.value)}
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 15,
                    }}
                  />
                </View>
                <View style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Lock size={18} color="#64748b" />
                  <Input
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onInput={(e: any) => setPassword(e.detail.value)}
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 15,
                    }}
                  />
                </View>
                <Button
                  onClick={handleAccountLogin}
                  loading={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Text className="text-white">登录</Text>
                </Button>
              </View>
            ) : (
              /* 微信登录 */
              <View>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 0',
                }}>
                  <View style={{
                    width: 64,
                    height: 64,
                    backgroundColor: '#07c160',
                    borderRadius: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <Text style={{ fontSize: 32 }}>微信</Text>
                  </View>
                  <Text style={{
                    display: 'block',
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#64748b',
                  }}>
                    点击下方按钮使用微信登录
                  </Text>
                </View>
                <Button
                  onClick={handleWechatLogin}
                  loading={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <Text className="text-white">微信一键登录</Text>
                </Button>
              </View>
            )}
          </>
        )}

        {/* 错误提示 */}
        {error && (
          <Text style={{
            display: 'block',
            textAlign: 'center',
            color: '#ef4444',
            fontSize: 13,
            marginTop: 12,
          }}>
            {error}
          </Text>
        )}

        {/* 底部协议 */}
        {!needVerify && (
          <Text style={{
            display: 'block',
            textAlign: 'center',
            fontSize: 11,
            color: '#94a3b8',
            marginTop: 16,
          }}>
            登录即表示同意《用户协议》和《隐私政策》
          </Text>
        )}
      </View>
    </View>
  )
}
