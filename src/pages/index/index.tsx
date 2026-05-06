import { View, Text } from '@tarojs/components'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Search, FileText, Calendar, MessageSquare, CircleQuestionMark, Settings, ChevronRight } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import './index.config'

export default function Index() {
  const [searchValue, setSearchValue] = useState('')

  const quickActions = [
    { icon: FileText, title: '文档助手', desc: '帮我写文档', color: 'bg-blue-500' },
    { icon: Calendar, title: '日程安排', desc: '智能排日程', color: 'bg-emerald-500' },
    { icon: MessageSquare, title: '会议纪要', desc: '生成会议总结', color: 'bg-amber-500' },
    { icon: CircleQuestionMark, title: '问答助手', desc: '解答工作问题', color: 'bg-purple-500' },
  ]

  const recentChats = [
    { id: 1, title: '项目进度汇报模板', preview: '帮我生成一份项目进度汇报...', time: '刚刚' },
    { id: 2, title: '代码审查建议', preview: '帮我看看这段代码有什么问题...', time: '10分钟前' },
    { id: 3, title: '周报总结', preview: '这周的周报应该怎么写...', time: '昨天' },
  ]

  return (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-6">
        <View className="flex items-center justify-between mb-5">
          <View>
            <Text className="block text-white text-lg font-semibold">您好，王小明</Text>
            <Text className="block text-blue-100 text-sm mt-1">有什么可以帮您的？</Text>
          </View>
          <View className="w-11 h-11 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <Settings size={20} color="#ffffff" />
          </View>
        </View>

        {/* Search */}
        <View className="bg-white bg-opacity-15 rounded-2xl px-4 py-3 flex items-center">
          <Search size={18} color="#bfdbfe" className="mr-2" />
          <View className="flex-1">
            <Input
              className="w-full text-white text-sm bg-transparent"
              placeholder="搜索或输入问题..."
              placeholderClass="text-blue-200"
              value={searchValue}
              onInput={(e) => setSearchValue(e.detail.value)}
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 -mt-4">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="block text-slate-800 text-base font-semibold mb-3">快捷入口</Text>
          <View className="grid grid-cols-4 gap-3">
            {quickActions.map((item, index) => (
              <View
                key={index}
                className="flex flex-col items-center"
                onClick={() => Taro.navigateTo({ url: '/pages/chat/index' })}
              >
                <View className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-2`}>
                  <item.icon size={22} color="#ffffff" />
                </View>
                <Text className="block text-slate-700 text-xs font-medium">{item.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Recent Chats */}
      <View className="px-4 mt-5">
        <View className="flex items-center justify-between mb-3">
          <Text className="block text-slate-800 text-base font-semibold">最近对话</Text>
          <View
            className="flex items-center"
            onClick={() => Taro.switchTab({ url: '/pages/history/index' })}
          >
            <Text className="block text-slate-500 text-sm">查看全部</Text>
            <ChevronRight size={16} color="#94a3b8" />
          </View>
        </View>

        <View className="bg-white rounded-2xl overflow-hidden">
          {recentChats.map((item, index) => (
            <View
              key={item.id}
              className={`p-4 flex items-center ${index !== recentChats.length - 1 ? 'border-b border-slate-100' : ''}`}
              onClick={() => Taro.navigateTo({ url: '/pages/chat/index' })}
            >
              <View className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-3">
                <MessageSquare size={18} color="#2563eb" />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="block text-slate-800 text-sm font-medium truncate">{item.title}</Text>
                <Text className="block text-slate-400 text-xs mt-1 truncate">{item.preview}</Text>
              </View>
              <Text className="text-slate-400 text-xs ml-2 shrink-0">{item.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* New Chat FAB */}
      <View
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => Taro.navigateTo({ url: '/pages/chat/index' })}
      >
        <MessageSquare size={24} color="#ffffff" />
      </View>
    </View>
  )
}
