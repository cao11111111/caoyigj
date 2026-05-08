import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { User, Settings, CircleAlert, FileText, MessageSquare, LogOut } from 'lucide-react-taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.config'

interface UserInfo {
  name: string
  avatar: string
  totalCards: number
  totalChats: number
}

interface MenuItem {
  icon: any
  title: string
  desc?: string
  showArrow?: boolean
  onClick?: () => void
}

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '加载中...',
    avatar: '',
    totalCards: 0,
    totalChats: 0
  })


  useEffect(() => {
    // 检查登录状态
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

  const menuItems: MenuItem[] = [
    { icon: FileText, title: '我的知识卡片', desc: `${userInfo.totalCards} 张`, onClick: () => Taro.switchTab({ url: '/pages/history/index' }) },
    { icon: MessageSquare, title: '我的对话', desc: `${userInfo.totalChats} 条`, onClick: () => Taro.switchTab({ url: '/pages/history/index' }) },
    { icon: Settings, title: '设置', showArrow: true },
    { icon: CircleAlert, title: '帮助与反馈', showArrow: true },
    { icon: LogOut, title: '退出登录', onClick: handleLogout },
  ]

  return (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-8">
        <Text className="block text-white text-xl font-semibold mb-4">我的</Text>
        
        {/* User Card */}
        <View className="bg-white rounded-2xl p-4 flex items-center">
          <View className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <User size={32} color="#2563eb" />
          </View>
          <View className="flex-1">
            <Text className="block text-slate-800 text-lg font-semibold">{userInfo.name}</Text>
            <Text className="block text-slate-500 text-sm mt-1">学校教师</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex mt-4 gap-3">
          <View className="flex-1 bg-white rounded-2xl p-4 text-center">
            <Text className="block text-blue-500 text-2xl font-bold">{userInfo.totalCards}</Text>
            <Text className="block text-slate-500 text-sm mt-1">知识卡片</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 text-center">
            <Text className="block text-blue-500 text-2xl font-bold">{userInfo.totalChats}</Text>
            <Text className="block text-slate-500 text-sm mt-1">对话次数</Text>
          </View>
        </View>
      </View>

      {/* Menu */}
      <View className="px-4 mt-4">
        <View className="bg-white rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <View
              key={index}
              className={`p-4 flex items-center ${index !== menuItems.length - 1 ? 'border-b border-slate-100' : ''}`}
              onClick={item.onClick}
            >
              <View className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-3">
                <item.icon size={18} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="block text-slate-800 text-sm font-medium">{item.title}</Text>
                {item.desc && (
                  <Text className="block text-slate-400 text-xs mt-1">{item.desc}</Text>
                )}
              </View>
              {item.showArrow && (
                <View className="text-slate-400">
                  <Text className="text-slate-400 text-sm">›</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Logout */}
      <View className="px-4 mt-4">
        <View className="bg-white rounded-2xl p-4 flex items-center justify-center">
          <LogOut size={18} color="#ef4444" className="mr-2" />
          <Text className="block text-red-500 text-sm font-medium">退出登录</Text>
        </View>
      </View>

      {/* Version */}
      <View className="px-4 mt-8 text-center">
        <Text className="block text-slate-400 text-xs">版本 1.0.0</Text>
      </View>
    </View>
  )
}
