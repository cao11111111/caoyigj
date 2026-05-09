import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react-taro'
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
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [useWechatInfo, setUseWechatInfo] = useState(false)
  const [wechatAvatar, setWechatAvatar] = useState('')
  const [wechatNickname, setWechatNickname] = useState('')

  const handleAccountLogin = async () => {
    if (!agreePrivacy) {
      setError('请先阅读并同意用户协议和隐私政策')
      return
    }
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
          const user = res.data.data.user
          Taro.setStorageSync('userInfo', user)
          // 检查是否需要填写个人信息
          if (!user?.nickname) {
            Taro.navigateTo({ url: '/pages/login/profile' })
          } else {
            Taro.switchTab({ url: '/pages/index/index' })
          }
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

  // 微信授权登录 - 一键获取头像昵称并登录
  const handleWechatAuth = async () => {
    if (!agreePrivacy) {
      setError('请先阅读并同意《用户服务协议》及《隐私政策》')
      return
    }
    
    // 微信环境下自动获取用户信息
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      try {
        // 获取 code
        const loginRes = await Taro.login()
        const code = loginRes.code || ''
        
        // 使用 button 的 open-type 获取头像，这里用默认头像
        // 昵称需要用户点击输入框手动输入（微信限制）
        setLoading(true)
        setError('')
        
        const res = await Network.request({
          url: '/api/auth/wechat-login',
          method: 'POST',
          data: { 
            code,
            avatar: wechatAvatar || '',
            nickname: wechatNickname || '微信用户'
          }
        })
        
        if (res.data.code === 200) {
          if (res.data.data.needVerify) {
            setTempToken(res.data.data.tempToken)
            setNeedVerify(true)
          } else {
            Taro.setStorageSync('token', res.data.data.token)
            Taro.setStorageSync('userInfo', res.data.data.user)
            const userInfo = res.data.data.user
            if (!userInfo?.nickname) {
              Taro.navigateTo({ url: '/pages/login/profile' })
            } else {
              Taro.switchTab({ url: '/pages/index/index' })
            }
          }
        } else {
          setError(res.data.msg || '登录失败')
        }
      } catch (err: any) {
        setError(err.message || '登录失败')
      } finally {
        setLoading(false)
      }
    } else {
      // H5 环境使用模拟登录
      handleWechatLogin()
    }
  }

  // 微信一键登录 - 自动获取微信头像和昵称
  const handleWechatQuickLogin = async () => {
    if (!agreePrivacy) {
      setError('请先阅读并同意《用户服务协议》及《隐私政策》')
      return
    }
    
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      setLoading(true)
      setError('')
      
      try {
        // 先获取微信授权获取昵称（通过 Input type="nickname"）
        // 然后获取头像
        // 这里先用模拟方式，等待用户点击头像选择
        const loginRes = await Taro.login()
        const code = loginRes.code || ''
        
        // 使用默认头像和昵称
        const nickname = '微信用户'
        const avatar = ''
        
        const res = await Network.request({
          url: '/api/auth/wechat-login',
          method: 'POST',
          data: { 
            code,
            avatar,
            nickname,
            quickLogin: true
          }
        })
        
        if (res.data.code === 200) {
          if (res.data.data.needVerify) {
            setTempToken(res.data.data.tempToken)
            setNeedVerify(true)
          } else {
            Taro.setStorageSync('token', res.data.data.token)
            Taro.setStorageSync('userInfo', res.data.data.user)
            const userInfo = res.data.data.user
            closeLogin()
            if (!userInfo?.nickname || userInfo.nickname === '微信用户') {
              Taro.navigateTo({ url: '/pages/login/profile' })
            } else {
              Taro.switchTab({ url: '/pages/index/index' })
            }
          }
        } else {
          setError(res.data.msg || '登录失败')
        }
      } catch (err: any) {
        setError(err.message || '登录失败')
      } finally {
        setLoading(false)
      }
    } else {
      handleWechatLogin()
    }
  }

  const handleWechatLogin = async () => {
    if (!agreePrivacy) {
      setError('请先阅读并同意《用户服务协议》及《隐私政策》')
      return
    }
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
        data: { 
          code,
          avatar: wechatAvatar,
          nickname: wechatNickname || '微信用户'
        }
      })
      console.log('微信登录响应:', res.data)
      
      if (res.data.code === 200) {
        if (res.data.data.needVerify) {
          setTempToken(res.data.data.tempToken)
          setNeedVerify(true)
        } else {
          Taro.setStorageSync('token', res.data.data.token)
          Taro.setStorageSync('userInfo', res.data.data.user)
          // 检查是否需要填写个人信息
          const userInfo = res.data.data.user
          if (!userInfo?.nickname) {
            Taro.navigateTo({ url: '/pages/login/profile' })
          } else {
            Taro.switchTab({ url: '/pages/index/index' })
          }
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
        const user = res.data.data.user
        Taro.setStorageSync('userInfo', user)
        // 检查是否需要填写个人信息
        if (!user?.nickname) {
          Taro.navigateTo({ url: '/pages/login/profile' })
        } else {
          Taro.switchTab({ url: '/pages/index/index' })
        }
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
    if (!agreePrivacy) {
      Taro.showToast({ title: '请先阅读并同意用户协议和隐私政策', icon: 'none' })
      return
    }
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
        
        {/* 隐私政策勾选框 - 单行布局 */}
        <View className="mt-4">
          <View 
            className="flex flex-row items-center p-3 bg-gray-50 rounded-lg"
            onClick={() => setAgreePrivacy(!agreePrivacy)}
          >
            <View 
              className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center mr-2"
            >
              {agreePrivacy && (
                <Text className="text-blue-500 text-sm">✓</Text>
              )}
            </View>
            <Text className="text-xs text-gray-500 flex-shrink-0">我已阅读并同意</Text>
            <View onClick={(e) => { e.stopPropagation(); Taro.navigateTo({ url: '/pages/login/agreement?type=service' }) }}>
              <Text className="text-xs text-blue-500">《用户服务协议》</Text>
            </View>
            <Text className="text-xs text-gray-500">和</Text>
            <View onClick={(e) => { e.stopPropagation(); Taro.navigateTo({ url: '/pages/login/agreement?type=privacy' }) }}>
              <Text className="text-xs text-blue-500">《隐私政策》</Text>
            </View>
          </View>
        </View>
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
              <>
                {/* 隐私政策勾选 */}
                <View className="flex flex-row items-start mb-4">
                  <View 
                    className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center mr-2 mt-1"
                    onClick={() => setAgreePrivacy(!agreePrivacy)}
                  >
                    {agreePrivacy && (
                      <Text className="text-blue-500 text-sm">✓</Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-gray-500">
                      我已阅读并同意
                      <Text className="text-blue-500">《用户服务协议》</Text>
                      和
                      <Text className="text-blue-500">《隐私政策》</Text>
                    </Text>
                  </View>
                </View>

                {loginType === 'account' ? (
                  <View className="space-y-4">
                    <View className="bg-gray-50 rounded-xl px-4 py-3">
                      <Input
                        className="w-full"
                        placeholder="请输入账号"
                        value={username}
                        onInput={(e: any) => setUsername(e.detail?.value || e.target?.value || '')}
                      />
                    </View>
                    <View className="bg-gray-50 rounded-xl px-4 py-3">
                      <Input
                        className="w-full"
                        placeholder="请输入密码"
                        password
                        value={password}
                        onInput={(e: any) => setPassword(e.detail?.value || e.target?.value || '')}
                      />
                    </View>
                    {error && (
                      <Text className="text-red-500 text-sm text-center">{error}</Text>
                    )}
                    <Button
                      onClick={handleAccountLogin}
                      className={`w-full h-12 rounded-full mt-2 ${agreePrivacy ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                      disabled={!agreePrivacy || loading}
                    >
                      <Text className={`text-base font-medium ${agreePrivacy ? 'text-white' : 'text-gray-500'}`}>
                        {loading ? '登录中...' : '登录'}
                      </Text>
                    </Button>
                  </View>
                ) : (
                  <View className="py-2">
                    {/* 是否使用微信信息勾选 */}
                    <View 
                      className="flex flex-row items-center mb-4 p-3 bg-gray-50 rounded-lg"
                      onClick={() => setUseWechatInfo(!useWechatInfo)}
                    >
                      <View 
                        className="w-5 h-5 border-2 border-green-500 rounded flex items-center justify-center mr-2"
                      >
                        {useWechatInfo && (
                          <Text className="text-green-500 text-sm">✓</Text>
                        )}
                      </View>
                      <Text className="text-sm text-gray-600">使用微信头像和昵称一键登录</Text>
                    </View>

                    {error && (
                      <Text className="text-red-500 text-sm text-center mb-3">{error}</Text>
                    )}

                    {useWechatInfo ? (
                      // 一键登录模式 - 使用微信头像和昵称
                      <>
                        <Button
                          onClick={handleWechatQuickLogin}
                          className={`w-full h-12 rounded-full ${agreePrivacy ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                          disabled={!agreePrivacy || loading}
                        >
                          <Text className={`text-base font-medium ${agreePrivacy ? 'text-white' : 'text-gray-500'}`}>
                            {loading ? '登录中...' : '微信一键登录'}
                          </Text>
                        </Button>
                        <Text className="text-xs text-gray-400 text-center mt-2">点击后将获取您的微信头像和昵称</Text>
                      </>
                    ) : (
                      // 手动选择模式 - 支持选择微信头像或上传本地图片
                      <>
                        {/* 头像选择区域 */}
                        <View className="flex flex-row items-center justify-center mb-3">
                          {/* 当前头像预览 */}
                          <View className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center mr-4">
                            {wechatAvatar ? (
                              <Image src={wechatAvatar} className="w-full h-full" mode="aspectFill" />
                            ) : (
                              <User className="text-gray-400" size={40} color="#9ca3af" />
                            )}
                          </View>
                          
                          {/* 头像操作按钮组 */}
                          <View className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              className={`px-4 ${agreePrivacy ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                              disabled={!agreePrivacy}
                              onClick={() => {
                                if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
                                  ;(Taro as any).chooseAvatar?.({
                                    success: (res: { avatarUrl: string }) => {
                                      setWechatAvatar(res.avatarUrl)
                                    }
                                  })
                                }
                              }}
                            >
                              <Text className={`text-xs ${agreePrivacy ? 'text-white' : 'text-gray-500'}`}>选择微信头像</Text>
                            </Button>
                            
                            <Button
                              size="sm"
                              className={`px-4 ${agreePrivacy ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                              disabled={!agreePrivacy}
                              onClick={() => {
                                Taro.chooseImage({
                                  count: 1,
                                  sizeType: ['compressed'],
                                  sourceType: ['album'],
                                  success: (res) => {
                                    if (res.tempFilePaths.length > 0) {
                                      setWechatAvatar(res.tempFilePaths[0])
                                    }
                                  }
                                })
                              }}
                            >
                              <Text className={`text-xs ${agreePrivacy ? 'text-white' : 'text-gray-500'}`}>上传本地图片</Text>
                            </Button>
                          </View>
                        </View>
                        
                        {/* 昵称输入 */}
                        <View className="bg-gray-50 rounded-xl px-4 py-3 mt-3">
                          <Input
                            type="nickname"
                            className="w-full text-center"
                            placeholder="点击输入微信昵称"
                            value={wechatNickname}
                            onInput={(e: any) => setWechatNickname(e.detail?.value || e.target?.value || '')}
                          />
                        </View>
                        
                        <Button
                          onClick={handleWechatAuth}
                          className={`w-full h-12 rounded-full mt-3 ${agreePrivacy && wechatAvatar && wechatNickname ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                          disabled={!agreePrivacy || !wechatAvatar || !wechatNickname || loading}
                        >
                          <Text className={`text-base font-medium ${agreePrivacy && wechatAvatar && wechatNickname ? 'text-white' : 'text-gray-500'}`}>
                            {loading ? '登录中...' : '确认登录'}
                          </Text>
                        </Button>
                      </>
                    )}
                  </View>
                )}
              </>
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
                    onInput={(e: any) => setVerifyCode(e.detail?.value || e.target?.value || '')}
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
