import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { ArrowLeft, Bot, Send, MoveVertical } from 'lucide-react-taro'
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

  return (
    <View className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 flex flex-col">
      {/* 顶部 Header */}
      <View className="bg-white bg-opacity-80 backdrop-blur-xl sticky top-0 z-50 h-14 flex items-center justify-between px-4 border-b border-slate-100">
        <View
          className="w-10 h-10 flex items-center justify-center active:bg-slate-100 rounded-full transition-colors"
          onClick={handleBack}
        >
          <ArrowLeft size={22} color="#64748b" />
        </View>
        <View className="flex-1 flex items-center justify-center">
          <Text className="text-base font-semibold text-slate-800">项目进度汇报</Text>
        </View>
        <View className="w-10 h-10 flex items-center justify-center active:bg-slate-100 rounded-full transition-colors">
          <MoveVertical size={22} color="#64748b" />
        </View>
      </View>

      {/* 消息列表 */}
      <View className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        {/* 用户消息 */}
        <View className="flex justify-end mb-4">
          <View className="max-w-[85%]">
            <View className="bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-3 rounded-2xl rounded-br-sm shadow-md">
              <Text className="block text-sm text-white leading-relaxed">{initialMessages[0].content}</Text>
            </View>
            <Text className="block text-xs text-slate-400 mt-2 text-right">{initialMessages[0].time}</Text>
          </View>
        </View>

        {/* AI 消息 */}
        <View className="flex justify-start mb-4">
          <View className="flex gap-3 max-w-[85%]">
            <View className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot size={18} color="#ffffff" />
            </View>
            <View className="flex-1 bg-white rounded-2xl rounded-tl-sm shadow-sm p-4">
              <Text className="block text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                好的，我来帮您整理本周项目进度和下周计划。
              </Text>
            </View>
          </View>
        </View>

        {/* AI 卡片消息 */}
        <View className="flex justify-start mb-4">
          <View className="flex gap-3 max-w-[85%]">
            <View className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md mt-1">
              <Bot size={18} color="#ffffff" />
            </View>
            <View className="bg-white rounded-2xl rounded-tl-sm shadow-sm p-4">
              <Text className="block text-sm font-semibold text-slate-800 mb-4">本周完成情况：</Text>
              <View className="space-y-3">
                <View className="flex items-start gap-3">
                  <View className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <View className="w-2 h-2 rounded-full bg-green-500" />
                  </View>
                  <Text className="block text-sm text-slate-600">需求文档评审已完成</Text>
                </View>
                <View className="flex items-start gap-3">
                  <View className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <View className="w-2 h-2 rounded-full bg-green-500" />
                  </View>
                  <Text className="block text-sm text-slate-600">UI 设计稿 V2.0 已交付</Text>
                </View>
                <View className="flex items-start gap-3">
                  <View className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <View className="w-2 h-2 rounded-full bg-green-500" />
                  </View>
                  <Text className="block text-sm text-slate-600">后端接口开发完成 80%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* AI 下周计划 */}
        <View className="flex justify-start mb-4">
          <View className="flex gap-3 max-w-[85%]">
            <View className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md mt-1">
              <Bot size={18} color="#ffffff" />
            </View>
            <View className="bg-white rounded-2xl rounded-tl-sm shadow-sm p-4">
              <Text className="block text-sm font-semibold text-slate-800 mb-4">下周计划：</Text>
              <View className="space-y-3">
                <View className="flex items-start gap-3">
                  <View className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 mt-1" />
                  <Text className="block text-sm text-slate-600">完成剩余 20% 后端接口</Text>
                </View>
                <View className="flex items-start gap-3">
                  <View className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 mt-1" />
                  <Text className="block text-sm text-slate-600">启动前端页面开发</Text>
                </View>
                <View className="flex items-start gap-3">
                  <View className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 mt-1" />
                  <Text className="block text-sm text-slate-600">第一轮联调测试</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Text className="block text-xs text-slate-400 ml-12">14:31</Text>
      </View>

      {/* 底部输入框 */}
      <View className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-xl border-t border-slate-100 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <View className="flex items-end gap-3">
          <View className="flex-1 bg-slate-100 rounded-2xl px-4 py-3">
            <Textarea
              style={{ width: '100%', minHeight: '24px', backgroundColor: 'transparent', fontSize: '15px', lineHeight: '24px' }}
              placeholder="输入消息..."
              value={inputValue}
              onInput={(e) => setInputValue(e.detail.value)}
              maxlength={500}
            />
          </View>
          <View 
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            onClick={handleSend}
          >
            <Send size={20} color="#ffffff" />
          </View>
        </View>
      </View>
    </View>
  )
}
