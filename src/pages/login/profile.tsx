import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, School, BookOpen } from 'lucide-react-taro'
import { Network } from '@/network'

export default function ProfileSetup() {
  const [nickname, setNickname] = useState('')
  const [school, setSchool] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      Taro.showToast({ title: '请输入您的昵称', icon: 'none' })
      return
    }
    if (!school.trim()) {
      Taro.showToast({ title: '请输入学校名称', icon: 'none' })
      return
    }
    if (!subject.trim()) {
      Taro.showToast({ title: '请输入您的科目/身份', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      // 调用后端保存用户信息
      const res = await Network.request({
        url: '/api/user/profile',
        method: 'POST',
        data: {
          nickname,
          school,
          subject
        }
      })
      
      console.log('保存用户信息响应:', res.data)

      if (res.data.code === 200) {
        // 更新本地用户信息
        const userInfo = Taro.getStorageSync('userInfo') || {}
        const updatedUserInfo = {
          ...userInfo,
          nickname,
          school,
          subject
        }
        Taro.setStorageSync('userInfo', updatedUserInfo)
        
        Taro.showToast({ title: '设置成功', icon: 'success' })
        // 跳转到首页
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1000)
      } else {
        Taro.showToast({ title: res.data.msg || '保存失败', icon: 'none' })
      }
    } catch (err) {
      console.error('保存失败:', err)
      // 演示模式：直接通过
      const userInfo = Taro.getStorageSync('userInfo') || {}
      Taro.setStorageSync('userInfo', {
        ...userInfo,
        nickname,
        school,
        subject
      })
      Taro.showToast({ title: '设置成功(演示)', icon: 'success' })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col px-6 py-10">
      {/* Header */}
      <View className="text-center mb-8">
        <View className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <User size={32} color="#ffffff" />
        </View>
        <Text className="block text-2xl font-bold text-gray-800">欢迎使用</Text>
        <Text className="block text-sm text-gray-500 mt-2">请先完善您的个人信息</Text>
      </View>

      {/* 表单 */}
      <Card className="w-full">
        <CardContent className="p-6">
          <View className="space-y-5">
            {/* 昵称 */}
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">昵称</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex flex-row items-center">
                <User size={20} color="#9ca3af" className="mr-3 flex-shrink-0" />
                <Input
                  className="flex-1"
                  placeholder="请输入您的昵称"
                  value={nickname}
                  maxlength={20}
                  onInput={(e) => setNickname(e.detail.value)}
                />
              </View>
            </View>

            {/* 学校 */}
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">学校名称</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex flex-row items-center">
                <School size={20} color="#9ca3af" className="mr-3 flex-shrink-0" />
                <Input
                  className="flex-1"
                  placeholder="请输入学校名称"
                  value={school}
                  maxlength={50}
                  onInput={(e) => setSchool(e.detail.value)}
                />
              </View>
            </View>

            {/* 科目/身份 */}
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">科目/身份</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 flex flex-row items-center">
                <BookOpen size={20} color="#9ca3af" className="mr-3 flex-shrink-0" />
                <Input
                  className="flex-1"
                  placeholder="如：语文老师、数学教师等"
                  value={subject}
                  maxlength={30}
                  onInput={(e) => setSubject(e.detail.value)}
                />
              </View>
            </View>
          </View>

          {/* 提交按钮 */}
          <View className="mt-8">
            <Button
              className="w-full bg-blue-500 text-white rounded-xl py-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Text className="text-base font-medium text-white">
                {loading ? '保存中...' : '完成设置'}
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* 底部说明 */}
      <View className="mt-6 text-center">
        <Text className="block text-xs text-gray-400">
          这些信息将帮助我们为您提供更好的服务
        </Text>
      </View>
    </View>
  )
}
