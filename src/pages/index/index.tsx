import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { BookOpen, Construction, Sparkles, Clock } from 'lucide-react-taro'
import { Network } from '@/network'
import LoginModal from '@/components/login-modal'
import './index.config'

interface RecentChat {
  id: number
  title: string
  preview: string
  time: string
  type: string
  imageUrl?: string
}

interface UserInfo {
  name: string
  avatar: string
  totalCards: number
  totalChats: number
}

export default function Index() {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '用户', avatar: '', totalCards: 0, totalChats: 0 })
  const [recentChats, setRecentChats] = useState<RecentChat[]>([])
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = () => {
    const token = Taro.getStorageSync('token')
    if (token) {
      setIsLoggedIn(true)
      fetchData()
    }
  }

  const fetchData = async () => {
    try {
      const userRes = await Network.request({
        url: '/api/user/info',
        method: 'GET'
      })
      if (userRes.data?.code === 200) {
        setUserInfo(userRes.data.data)
      }

      const recentRes = await Network.request({
        url: '/api/conversations/recent',
        method: 'GET'
      })
      if (recentRes.data?.code === 200) {
        setRecentChats(recentRes.data.data || [])
      }
    } catch (e) {
      console.error('获取数据失败', e)
    }
  }

  const quickActions = [
    { icon: BookOpen, title: '知识卡片', desc: '生成教学卡片', color: 'bg-blue-500', available: true, type: 'knowledge' },
    { icon: Construction, title: '待开发', desc: '功能开发中', color: 'bg-slate-400', available: false, type: 'pending' },
  ]

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (!isLoggedIn) {
      setShowLogin(true)
      return
    }
    if (action.available) {
      Taro.navigateTo({ url: '/pages/knowledge-card/index' })
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' })
    }
  }

  const handleChatClick = (chat: RecentChat) => {
    if (chat.type === 'knowledge' && chat.imageUrl) {
      Taro.navigateTo({
        url: `/pages/knowledge-card/result?imageUrl=${encodeURIComponent(chat.imageUrl)}`
      })
    }
  }

  // 未登录状态
  const unLoggedInView = (
    <View className="min-h-screen bg-slate-50">
      {/* 顶部区域 */}
      <View className="bg-blue-500 px-5 pt-12 pb-16">
        <Text className="block text-white text-2xl font-bold">曹一工具箱</Text>
      </View>

      {/* 登录卡片 */}
      <View className="px-4 -mt-10">
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="block text-slate-800 text-lg font-bold mb-4">欢迎使用</Text>
          <Text className="block text-slate-500 text-sm mb-6">
            点击下方按钮登录，开启智能工具之旅
          </Text>
          <View 
            className="bg-blue-500 rounded-xl py-3 text-center"
            onClick={() => Taro.navigateTo({ url: '/pages/login/index' })}
          >
            <Text className="text-white font-medium">立即登录</Text>
          </View>
        </View>
      </View>

      {/* 功能介绍 */}
      <View className="px-4 mt-6">
        <View className="bg-white rounded-2xl p-5 shadow-md">
          <Text className="block text-slate-800 font-semibold mb-4">功能介绍</Text>
          <View className="space-y-4">
            <View className="flex items-start">
              <View className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                <BookOpen size={20} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="block text-slate-700 font-medium">知识卡片</Text>
                <Text className="block text-slate-400 text-sm mt-1">输入内容生成手绘风格教学卡片</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  // 已登录状态
  const loggedInView = (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* 顶部欢迎区域 */}
      <View className="bg-blue-500 px-5 pt-12 pb-8">
        <View className="flex items-center">
          <View className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
            <Text className="text-xl">👋</Text>
          </View>
          <View>
            <Text className="block text-white text-lg font-bold">{userInfo.name}</Text>
          </View>
        </View>
        
        {/* 统计卡片 */}
        <View className="flex gap-3 mt-5">
          <View className="flex-1 bg-white bg-opacity-20 rounded-xl p-3">
            <View className="flex items-center">
              <BookOpen size={14} color="#ffffff" />
              <Text className="text-white text-xs ml-2">卡片总数</Text>
            </View>
            <Text className="block text-white text-xl font-bold mt-1">{userInfo.totalCards}</Text>
          </View>
          <View className="flex-1 bg-white bg-opacity-20 rounded-xl p-3">
            <View className="flex items-center">
              <Clock size={14} color="#ffffff" />
              <Text className="text-white text-xs ml-2">对话次数</Text>
            </View>
            <Text className="block text-white text-xl font-bold mt-1">{userInfo.totalChats}</Text>
          </View>
        </View>
      </View>

      {/* 快捷入口 */}
      <View className="px-4 -mt-4">
        <View className="bg-white rounded-2xl p-4 shadow-md">
          <View className="flex items-center mb-4">
            <Sparkles size={18} color="#2563EB" />
            <Text className="block text-slate-800 font-semibold ml-2">快捷入口</Text>
          </View>
          
          <View className="flex gap-3">
            {quickActions.map((action, index) => (
              <View
                key={index}
                className="flex-1 bg-slate-50 rounded-xl p-4"
                onClick={() => handleQuickAction(action)}
              >
                <View className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                  <action.icon size={20} color="#ffffff" />
                </View>
                <Text className="block text-slate-700 font-medium text-sm">{action.title}</Text>
                <Text className="block text-slate-400 text-xs mt-1">{action.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 最近对话 */}
      <View className="px-4 mt-6">
        <View className="flex items-center justify-between mb-3">
          <Text className="block text-slate-800 font-semibold">最近对话</Text>
          {recentChats.length > 3 && (
            <Text className="text-blue-500 text-sm">查看全部</Text>
          )}
        </View>
        
        {recentChats.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 shadow-md text-center">
            <Text className="block text-slate-400 text-sm">暂无对话记录</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {recentChats.slice(0, 3).map((chat) => (
              <View
                key={chat.id}
                className="bg-white rounded-2xl p-4 shadow-md flex items-center"
                onClick={() => handleChatClick(chat)}
              >
                <View className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <BookOpen size={20} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="block text-slate-700 font-medium">{chat.title}</Text>
                  <Text className="block text-slate-400 text-xs mt-1">{chat.time}</Text>
                </View>
                <Text className="text-slate-400">›</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )

  return (
    <View>
      {isLoggedIn ? loggedInView : unLoggedInView}
      <LoginModal 
        show={showLogin} 
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setIsLoggedIn(true)
          setShowLogin(false)
          fetchData()
        }}
      />
    </View>
  )
}
