import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { ArrowLeft, Bot, Send, Copy, Star, Mail, MessageSquare, Link } from 'lucide-react-taro'
import { Textarea } from '@/components/ui/textarea'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: '帮我整理一下本周项目的完成情况和下周计划',
    time: '14:30'
  },
  {
    id: '2',
    role: 'assistant',
    content: `好的，我来帮您整理本周项目进度和下周计划。

**本周完成情况：**

• 需求文档评审已完成
• UI 设计稿 V2.0 已交付
• 后端接口开发完成 80%

**下周计划：**

○ 完成剩余 20% 后端接口
○ 启动前端页面开发
○ 第一轮联调测试`,
    time: '14:31'
  },
  {
    id: '3',
    role: 'user',
    content: '能把这个计划分享给团队成员吗？',
    time: '14:35'
  },
  {
    id: '4',
    role: 'assistant',
    content: `当然可以！您可以选择以下方式分享：`,
    time: '14:35'
  }
]

export default function Chat() {
  const [inputValue, setInputValue] = useState('')

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    setInputValue('')
  }

  const handleCopy = () => {
    Taro.showToast({ title: '已复制', icon: 'success' })
  }

  const handleFavorite = () => {
    Taro.showToast({ title: '已收藏', icon: 'success' })
  }

  return (
    <View className="min-h-screen bg-background flex flex-col">
      {/* 顶部 Header */}
      <View className="bg-background sticky top-0 z-40 h-14 flex items-center justify-between px-4 border-b border-outline">
        <View
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant active:bg-surface-container rounded-full"
          onClick={handleBack}
        >
          <ArrowLeft size={20} color="#64748B" />
        </View>
        <Text className="text-base font-semibold text-on-surface truncate max-w-[200px]">项目进度汇报</Text>
        <View className="w-10 h-10 flex items-center justify-center text-on-surface-variant active:bg-surface-container rounded-full">
          <View className="w-5 h-5">
            <Text className="text-lg">···</Text>
          </View>
        </View>
      </View>

      {/* 消息列表 */}
      <View className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        {/* 用户消息 */}
        <View className="flex gap-3 justify-end mb-4">
          <View className="max-w-[80%]">
            <View className="bg-primary px-4 py-3 rounded-2xl rounded-tr-sm">
              <Text className="block text-sm text-white">{initialMessages[0].content}</Text>
            </View>
            <Text className="block text-xs text-on-surface-variant mt-1 text-right">{initialMessages[0].time}</Text>
          </View>
        </View>

        {/* AI 消息 */}
        <View className="flex gap-3 justify-start mb-4">
          <View className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 mt-2">
            <Bot size={16} color="#1E40AF" />
          </View>
          <View className="max-w-[80%]">
            <View className="bg-surface px-4 py-3 rounded-2xl rounded-tl-sm shadow-card">
              <Text className="block text-sm text-on-surface whitespace-pre-wrap">
                好的，我来帮您整理本周项目进度和下周计划。
              </Text>
            </View>
            <View className="bg-surface px-4 py-3 rounded-2xl rounded-tl-sm shadow-card mt-2">
              <Text className="block text-sm font-medium text-on-surface mb-3">本周完成情况：</Text>
              <View className="space-y-2">
                <View className="flex items-start gap-2">
                  <View className="w-4 h-4 rounded-full bg-success mt-1 flex-shrink-0" />
                  <Text className="block text-sm text-on-surface">需求文档评审已完成</Text>
                </View>
                <View className="flex items-start gap-2">
                  <View className="w-4 h-4 rounded-full bg-success mt-1 flex-shrink-0" />
                  <Text className="block text-sm text-on-surface">UI 设计稿 V2.0 已交付</Text>
                </View>
                <View className="flex items-start gap-2">
                  <View className="w-4 h-4 rounded-full bg-success mt-1 flex-shrink-0" />
                  <Text className="block text-sm text-on-surface">后端接口开发完成 80%</Text>
                </View>
              </View>
            </View>
            <Text className="block text-xs text-on-surface-variant mt-1">14:31</Text>
          </View>
        </View>

        {/* AI 继续消息 */}
        <View className="flex gap-3 justify-start mb-4">
          <View className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 mt-2">
            <Bot size={16} color="#1E40AF" />
          </View>
          <View className="max-w-[80%]">
            <View className="bg-surface px-4 py-3 rounded-2xl rounded-tl-sm shadow-card">
              <Text className="block text-sm font-medium text-on-surface mb-3">下周计划：</Text>
              <View className="space-y-2">
                <View className="flex items-start gap-2">
                  <View className="w-4 h-4 rounded-full border-2 border-on-surface-variant mt-1 flex-shrink-0" />
                  <Text className="block text-sm text-on-surface">完成剩余 20% 后端接口</Text>
                </View>
                <View className="flex items-start gap-2">
                  <View className="w-4 h-4 rounded-full border-2 border-on-surface-variant mt-1 flex-shrink-0" />
                  <Text className="block text-sm text-on-surface">启动前端页面开发</Text>
                </View>
                <View className="flex items-start gap-2">
                  <View className="w-4 h-4 rounded-full border-2 border-on-surface-variant mt-1 flex-shrink-0" />
                  <Text className="block text-sm text-on-surface">第一轮联调测试</Text>
                </View>
              </View>
            </View>
            <View className="flex items-center gap-2 mt-2">
              <View
                className="flex items-center gap-1 px-3 py-2 text-xs text-on-surface-variant bg-surface-container rounded-full active:bg-surface-container-high"
                onClick={handleCopy}
              >
                <Copy size={12} color="#64748B" />
                <Text>复制</Text>
              </View>
              <View
                className="flex items-center gap-1 px-3 py-2 text-xs text-on-surface-variant bg-surface-container rounded-full active:bg-surface-container-high"
                onClick={handleFavorite}
              >
                <Star size={12} color="#64748B" />
                <Text>收藏</Text>
              </View>
            </View>
            <Text className="block text-xs text-on-surface-variant mt-1">14:31</Text>
          </View>
        </View>

        {/* 用户追问 */}
        <View className="flex gap-3 justify-end mb-4">
          <View className="max-w-[80%]">
            <View className="bg-primary px-4 py-3 rounded-2xl rounded-tr-sm">
              <Text className="block text-sm text-white">{initialMessages[2].content}</Text>
            </View>
            <Text className="block text-xs text-on-surface-variant mt-1 text-right">{initialMessages[2].time}</Text>
          </View>
        </View>

        {/* AI 回复 */}
        <View className="flex gap-3 justify-start mb-4">
          <View className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 mt-2">
            <Bot size={16} color="#1E40AF" />
          </View>
          <View className="max-w-[80%]">
            <View className="bg-surface px-4 py-3 rounded-2xl rounded-tl-sm shadow-card">
              <Text className="block text-sm text-on-surface">当然可以！您可以选择以下方式分享：</Text>
              <View className="flex flex-wrap gap-2 mt-3">
                <View className="flex items-center gap-1 px-3 py-2 text-xs bg-primary-container text-primary rounded-lg">
                  <Mail size={12} color="#1E40AF" />
                  <Text>邮件</Text>
                </View>
                <View className="flex items-center gap-1 px-3 py-2 text-xs bg-primary-container text-primary rounded-lg">
                  <MessageSquare size={12} color="#1E40AF" />
                  <Text>微信</Text>
                </View>
                <View className="flex items-center gap-1 px-3 py-2 text-xs bg-primary-container text-primary rounded-lg">
                  <Link size={12} color="#1E40AF" />
                  <Text>复制链接</Text>
                </View>
              </View>
            </View>
            <Text className="block text-xs text-on-surface-variant mt-1">14:35</Text>
          </View>
        </View>
      </View>

      {/* 底部输入框 */}
      <View style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-outline)',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom))'
      }}>
        <View className="flex items-end gap-3 px-4 py-3">
          <View className="flex-1 bg-surface-container rounded-2xl px-4 py-3">
            <View style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                <Textarea
                  style={{ width: '100%', backgroundColor: 'transparent', fontSize: '14px', color: 'var(--color-on-surface)', minHeight: '24px' }}
                  placeholder="输入消息..."
                  value={inputValue}
                  onInput={(e) => setInputValue(e.detail.value)}
                  maxlength={500}
                />
              </View>
              <View className="w-8 h-8 flex items-center justify-center text-on-surface-variant">
                <Text className="block text-lg text-on-surface-variant">+</Text>
              </View>
            </View>
          </View>
          <View
            className="w-11 h-11 flex items-center justify-center bg-primary rounded-full active:bg-primary"
            onClick={handleSend}
          >
            <Send size={20} color="#ffffff" />
          </View>
        </View>
      </View>
    </View>
  )
}
