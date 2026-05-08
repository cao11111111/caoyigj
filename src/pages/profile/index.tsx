import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Settings, CircleAlert, FileText, MessageSquare, LogOut, ChevronRight, BookOpen, MessageCircle } from 'lucide-react-taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.config'

interface UserInfo {
  name: string
  avatar: string
  totalCards: number
  totalChats: number
}

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '加载中...',
    avatar: '',
    totalCards: 0,
    totalChats: 0
  })

  useEffect(() => {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.reLaunch({ url: '/pages/login/index' })
      return
    }
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const res = await Network.request({
        url: '/api/user/info',
        method: 'GET'
      })
      if (res.data?.code === 200) {
        setUserInfo(res.data.data)
      }
    } catch (e) {
      console.error('获取用户信息失败', e)
    }
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('token')
          Taro.removeStorageSync('userInfo')
          Taro.reLaunch({ url: '/pages/login/index' })
        }
      }
    })
  }

  const menuItems = [
    { icon: FileText, title: '我的知识卡片', desc: '查看已生成的卡片', onClick: () => Taro.switchTab({ url: '/pages/history/index' }) },
    { icon: MessageSquare, title: '我的对话', desc: '查看对话记录', onClick: () => Taro.switchTab({ url: '/pages/history/index' }) },
    { icon: Settings, title: '设置', desc: '应用设置', showArrow: true },
    { icon: CircleAlert, title: '帮助与反馈', desc: '遇到问题？联系我们', showArrow: true },
  ]

  return (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* 顶部区域 */}
      <View className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 px-5 pt-12 pb-8 relative overflow-hidden">
        {/* 装饰 */}
        <View className="absolute top-16 right-8 w-40 h-40 bg-white opacity-5 rounded-full" />
        <View className="absolute bottom-4 left-4 w-24 h-24 bg-white opacity-5 rounded-full" />
        
        <View className="relative z-10">
          <Text className="block text-white text-xl font-bold mb-5">我的</Text>
          
          {/* 用户卡片 */}
          <View className="bg-white bg-opacity-20 rounded-2xl p-4 flex items-center backdrop-blur-sm">
            <View className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4 shadow-lg">
              <Text className="text-2xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="block text-white text-xl font-bold">{userInfo.name}</Text>
              <Text className="block text-blue-100 text-sm mt-1">曹一工具箱用户</Text>
            </View>
          </View>
          
          {/* 统计 */}
          <View className="flex gap-3 mt-4">
            <View className="flex-1 bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
              <View className="flex items-center justify-center">
                <BookOpen size={16} color="#ffffff" />
                <Text className="text-white text-xs ml-2">知识卡片</Text>
              </View>
              <Text className="block text-white text-2xl font-bold mt-1 text-center">{userInfo.totalCards}</Text>
            </View>
            <View className="flex-1 bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
              <View className="flex items-center justify-center">
                <MessageCircle size={16} color="#ffffff" />
                <Text className="text-white text-xs ml-2">对话次数</Text>
              </View>
              <Text className="block text-white text-2xl font-bold mt-1 text-center">{userInfo.totalChats}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 菜单列表 */}
      <View className="px-4 -mt-3">
        <View className="bg-white rounded-2xl shadow-md overflow-hidden">
          {menuItems.map((item, index) => (
            <View
              key={index}
              className={`p-4 flex items-center ${index !== menuItems.length - 1 ? 'border-b border-slate-100' : ''}`}
              onClick={item.onClick}
            >
              <View className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mr-3">
                <item.icon size={20} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="block text-slate-800 text-sm font-medium">{item.title}</Text>
                <Text className="block text-slate-400 text-xs mt-1">{item.desc}</Text>
              </View>
              {item.showArrow && (
                <ChevronRight size={18} color="#CBD5E1" />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 退出登录 */}
      <View className="px-4 mt-5">
        <View 
          className="bg-white rounded-2xl p-4 flex items-center justify-center shadow-sm"
          onClick={handleLogout}
        >
          <LogOut size={18} color="#EF4444" className="mr-2" />
          <Text className="block text-red-500 text-sm font-medium">退出登录</Text>
        </View>
      </View>

      {/* 版本信息 */}
      <View className="px-4 mt-8 text-center">
        <Text className="block text-slate-400 text-xs">曹一工具箱 v1.0.0</Text>
      </View>
    </View>
  )
}
