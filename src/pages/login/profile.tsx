import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, School, BookOpen, Sparkles, Check } from 'lucide-react-taro'
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
      const res = await Network.request({
        url: '/api/user/profile',
        method: 'POST',
        data: { nickname, school, subject }
      })

      if (res.data.code === 200) {
        const userInfo = Taro.getStorageSync('userInfo') || {}
        Taro.setStorageSync('userInfo', {
          ...userInfo,
          nickname,
          school,
          subject
        })
        Taro.showToast({ title: '设置成功', icon: 'success' })
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1000)
      } else {
        Taro.showToast({ title: res.data.msg || '保存失败', icon: 'none' })
      }
    } catch (err) {
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
    <View className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* 顶部装饰 */}
      <View className="h-40 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 relative overflow-hidden">
        <View className="absolute top-12 right-8 w-32 h-32 bg-white opacity-10 rounded-full" />
        <View className="absolute bottom-4 left-4 w-20 h-20 bg-white opacity-10 rounded-full" />
      </View>

      <View className="px-5 -mt-20 relative z-10 flex-1">
        {/* Header Card */}
        <View className="bg-white rounded-2xl shadow-lg p-6 mb-5">
          <View className="flex items-center mb-4">
            <View className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-md">
              <User size={32} color="#ffffff" />
            </View>
            <View>
              <Text className="block text-xl font-bold text-slate-800">完善信息</Text>
              <Text className="block text-slate-400 text-sm mt-1">请填写您的个人信息</Text>
            </View>
          </View>
        </View>

        {/* Form Card */}
        <View className="bg-white rounded-2xl shadow-md p-5">
          <View className="space-y-5">
            {/* 昵称 */}
            <View>
              <Text className="block text-sm font-medium text-slate-700 mb-2">昵称</Text>
              <View className="bg-slate-50 rounded-xl px-4 py-4 flex flex-row items-center border border-slate-200">
                <User size={20} color="#94A3B8" className="mr-3 flex-shrink-0" />
                <Input
                  className="flex-1 text-base"
                  placeholder="请输入您的昵称"
                  value={nickname}
                  maxlength={20}
                  onInput={(e) => setNickname(e.detail.value)}
                />
              </View>
            </View>

            {/* 学校 */}
            <View>
              <Text className="block text-sm font-medium text-slate-700 mb-2">学校名称</Text>
              <View className="bg-slate-50 rounded-xl px-4 py-4 flex flex-row items-center border border-slate-200">
                <School size={20} color="#94A3B8" className="mr-3 flex-shrink-0" />
                <Input
                  className="flex-1 text-base"
                  placeholder="请输入学校名称"
                  value={school}
                  maxlength={50}
                  onInput={(e) => setSchool(e.detail.value)}
                />
              </View>
            </View>

            {/* 科目/身份 */}
            <View>
              <Text className="block text-sm font-medium text-slate-700 mb-2">科目/身份</Text>
              <View className="bg-slate-50 rounded-xl px-4 py-4 flex flex-row items-center border border-slate-200">
                <BookOpen size={20} color="#94A3B8" className="mr-3 flex-shrink-0" />
                <Input
                  className="flex-1 text-base"
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-4 shadow-md shadow-blue-200"
              onClick={handleSubmit}
              disabled={loading}
            >
              <View className="flex items-center justify-center">
                <Check size={18} color="#ffffff" className="mr-2" />
                <Text className="text-base font-medium text-white">
                  {loading ? '保存中...' : '完成设置'}
                </Text>
              </View>
            </Button>
          </View>
        </View>

        {/* 底部说明 */}
        <View className="mt-6 mb-6 text-center">
          <View className="flex items-center justify-center">
            <Sparkles size={14} color="#94A3B8" />
            <Text className="block text-xs text-slate-400 ml-2">
              这些信息将帮助我们为您提供更好的服务
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
