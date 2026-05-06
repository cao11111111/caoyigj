import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { FileText, Calendar, Search, Sparkles, Plus, Bot, ArrowRight, MessageCircle } from 'lucide-react-taro'

interface QuickAction {
  icon: typeof FileText
  label: string
  gradient: string
  path: string
}

interface RecentChat {
  id: string
  title: string
  preview: string
  time: string
  icon: typeof FileText
  iconBg: string
}

const quickActions: QuickAction[] = [
  { icon: FileText, label: '文档助手', gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500', path: '/pages/chat/index' },
  { icon: Calendar, label: '日程安排', gradient: 'bg-gradient-to-br from-pink-500 to-rose-500', path: '/pages/chat/index' },
  { icon: Search, label: '知识检索', gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500', path: '/pages/chat/index' },
  { icon: Sparkles, label: '创意灵感', gradient: 'bg-gradient-to-br from-amber-500 to-orange-500', path: '/pages/chat/index' },
]

const recentChats: RecentChat[] = [
  {
    id: '1',
    title: '项目进度汇报',
    preview: '帮我整理一下本周项目的完成情况和下周计划...',
    time: '今天 14:30',
    icon: FileText,
    iconBg: 'bg-indigo-100'
  },
  {
    id: '2',
    title: '代码问题排查',
    preview: '这段 Python 代码为什么运行报错？请帮我分析原因...',
    time: '昨天 16:45',
    icon: MessageCircle,
    iconBg: 'bg-purple-100'
  },
]

export default function Index() {
  const handleQuickAction = (path: string) => {
    Taro.navigateTo({ url: path })
  }

  const handleRecentChat = () => {
    Taro.navigateTo({ url: '/pages/chat/index' })
  }

  const handleNewChat = () => {
    Taro.navigateTo({ url: '/pages/chat/index' })
  }

  return (
    <View className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50 pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {/* Hero Header */}
      <View className="relative px-5 pt-8 pb-6">
        {/* 装饰性背景 */}
        <View className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-full opacity-40 blur-3xl" />
        <View className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-200 to-indigo-200 rounded-full opacity-30 blur-2xl" />
        
        {/* 用户信息 */}
        <View className="relative flex items-center gap-4">
          <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot size={28} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="block text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">您好，小初</Text>
            <Text className="block text-sm text-slate-500 mt-1">有什么可以帮您的？</Text>
          </View>
        </View>

        {/* 新建对话按钮 */}
        <View 
          className="mt-5 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg active:scale-95 transition-transform"
          onClick={handleNewChat}
        >
          <Plus size={20} color="#ffffff" strokeWidth={2.5} />
          <Text className="text-base font-semibold text-white">新建对话</Text>
        </View>
      </View>

      {/* 快捷入口 */}
      <View className="px-5 mb-6">
        <View className="flex items-center justify-between mb-4">
          <Text className="text-base font-semibold text-slate-800">快捷入口</Text>
        </View>
        <View className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <View
              key={index}
              className="flex flex-col items-center gap-3 py-4 px-2 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform"
              onClick={() => handleQuickAction(action.path)}
            >
              <View className={`w-11 h-11 rounded-xl ${action.gradient} flex items-center justify-center shadow-md`}>
                <action.icon size={22} color="#ffffff" />
              </View>
              <Text className="text-xs font-medium text-slate-700">{action.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 最近对话 */}
      <View className="px-5 mb-6">
        <View className="flex items-center justify-between mb-4">
          <Text className="text-base font-semibold text-slate-800">最近对话</Text>
          <Text className="text-sm font-medium text-indigo-500">查看全部</Text>
        </View>
        
        <View className="space-y-3">
          {recentChats.map((chat) => (
            <View
              key={chat.id}
              className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm active:bg-slate-50 transition-colors"
              onClick={handleRecentChat}
            >
              <View className={`w-12 h-12 rounded-xl ${chat.iconBg} flex items-center justify-center flex-shrink-0`}>
                <chat.icon size={22} color="#6366f1" />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="block text-sm font-semibold text-slate-800 mb-1">{chat.title}</Text>
                <Text className="block text-xs text-slate-500 truncate">{chat.preview}</Text>
              </View>
              <View className="flex flex-col items-end gap-2">
                <Text className="text-xs text-slate-400">{chat.time}</Text>
                <View className="flex items-center gap-1 text-indigo-500">
                  <Text className="text-xs font-medium">继续</Text>
                  <ArrowRight size={12} color="#6366f1" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 底部留白 */}
      <View className="h-4" />
    </View>
  )
}
