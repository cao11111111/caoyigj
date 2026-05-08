import { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { User, Lock, X, Eye, EyeOff } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { Network } from '@/network'

declare const wx: any

interface LoginModalProps {
  show: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function LoginModal({ show, onClose, onSuccess }: LoginModalProps) {
  const [loginType, setLoginType] = useState<'account' | 'wechat'>('account')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needVerify, setNeedVerify] = useState(false)
  const [tempToken, setTempToken] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // 账号登录
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
      console.log('登录响应:', res.data)
      
      if (res.data.code === 200) {
        if (res.data.data.needVerify) {
          setTempToken(res.data.data.tempToken)
          setNeedVerify(true)
        } else {
          Taro.setStorageSync('token', res.data.data.token)
          Taro.setStorageSync('user', JSON.stringify(res.data.data.user))
          onSuccess()
        }
      } else {
        setError(res.data.msg || '登录失败')
      }
    } catch (err: any) {
      setError(err.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  // 微信登录
  const handleWechatLogin = async () => {
    setLoading(true)
    setError('')
    try {
      let code = 'mock_code_h5_' + Date.now()
      
      // 小程序端获取真实code
      if (Taro.getEnv() === 'WEAPP') {
        const wechatRes = await new Promise((resolve, reject) => {
          wx.login({
            success: (res: any) => resolve(res.code),
            fail: reject
          })
        })
        code = wechatRes as string
      }
      
      const res: any = await Network.request({
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
          Taro.setStorageSync('user', JSON.stringify(res.data.data.user))
          onSuccess()
        }
      } else {
        setError(res.data.msg || '登录失败')
      }
    } catch (err: any) {
      setError(err.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  // 验证验证码
  const handleVerify = async () => {
    if (verifyCode !== '123456') {
      setError('验证码错误')
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
      console.log('验证响应:', res.data)
      
      if (res.data.code === 200) {
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('user', JSON.stringify(res.data.data.user))
        onSuccess()
      } else {
        setError(res.data.msg || '验证失败')
      }
    } catch (err: any) {
      setError(err.message || '网络错误')
    } finally {
      setLoading(false)
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
      backgroundColor: 'rgba(37, 99, 235, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    }}
    >
      <View style={{
        width: '85%',
        maxWidth: 360,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        position: 'relative',
      }}
      >
        {/* 关闭按钮 */}
        <View 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} color="#94a3b8" />
        </View>

        <Text style={{
          display: 'block',
          textAlign: 'center',
          fontSize: 20,
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: 20,
        }}
        >
          {needVerify ? '验证身份' : '用户登录'}
        </Text>

        {needVerify ? (
          /* 验证码验证 */
          <View>
            <Text style={{
              display: 'block',
              textAlign: 'center',
              fontSize: 14,
              color: '#64748b',
              marginBottom: 16,
            }}
            >
              请输入验证码完成验证
            </Text>
            <View style={{
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
            }}
            >
              <Input
                placeholder="请输入验证码"
                value={verifyCode}
                onInput={(e: any) => setVerifyCode(e.detail.value)}
                style={{
                  flex: 1,
                  fontSize: 15,
                }}
              />
            </View>
            <Text style={{
              display: 'block',
              textAlign: 'center',
              fontSize: 12,
              color: '#94a3b8',
              marginBottom: 16,
            }}
            >
              演示验证码：123456
            </Text>
            <View 
              onClick={handleVerify}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                borderRadius: 12,
                padding: '14px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '500',
              }}
              >
                {loading ? '验证中...' : '确认'}
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* 登录方式切换 */}
            <View style={{
              display: 'flex',
              marginBottom: 20,
              backgroundColor: '#f1f5f9',
              borderRadius: 10,
              padding: 4,
            }}
            >
              <View 
                onClick={() => setLoginType('account')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: loginType === 'account' ? '#ffffff' : 'transparent',
                  borderRadius: 8,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: loginType === 'account' ? '#2563eb' : '#64748b',
                  fontWeight: loginType === 'account' ? '600' : '400',
                }}
                >
                  账号登录
                </Text>
              </View>
              <View 
                onClick={() => setLoginType('wechat')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: loginType === 'wechat' ? '#ffffff' : 'transparent',
                  borderRadius: 8,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: loginType === 'wechat' ? '#2563eb' : '#64748b',
                  fontWeight: loginType === 'wechat' ? '600' : '400',
                }}
                >
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
                }}
                >
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
                }}
                >
                  <Lock size={18} color="#64748b" />
                  <Input
                    type="text"
                    password={!showPassword}
                    placeholder="请输入密码"
                    value={password}
                    onInput={(e: any) => setPassword(e.detail.value)}
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 15,
                    }}
                  />
                  <View 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      padding: 4,
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="#94a3b8" />
                    ) : (
                      <Eye size={18} color="#94a3b8" />
                    )}
                  </View>
                </View>
                <View 
                  onClick={handleAccountLogin}
                  style={{
                    width: '100%',
                    backgroundColor: '#2563eb',
                    borderRadius: 12,
                    padding: '14px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '500',
                  }}
                  >
                    {loading ? '登录中...' : '登录'}
                  </Text>
                </View>
              </View>
            ) : (
              /* 微信登录 */
              <View>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 0',
                }}
                >
                  <View style={{
                    width: 64,
                    height: 64,
                    backgroundColor: '#07c160',
                    borderRadius: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                  >
                    <Text style={{ fontSize: 28, color: '#ffffff' }}>微</Text>
                  </View>
                  <Text style={{
                    fontSize: 14,
                    color: '#64748b',
                    textAlign: 'center',
                  }}
                  >
                    点击下方按钮使用微信登录
                  </Text>
                </View>
                <View 
                  onClick={handleWechatLogin}
                  style={{
                    width: '100%',
                    backgroundColor: '#07c160',
                    borderRadius: 12,
                    padding: '14px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '500',
                  }}
                  >
                    {loading ? '登录中...' : '微信一键登录'}
                  </Text>
                </View>
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
          }}
          >
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
          }}
          >
            登录即表示同意《用户协议》和《隐私政策》
          </Text>
        )}
      </View>
    </View>
  )
}
