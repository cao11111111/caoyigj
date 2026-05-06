
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { MessageCircle, FileText, Calendar, Mail, Search, Plus, Bot, CornerUpRight } from 'lucide-react-taro'

interface QuickAction {
  icon: typeof FileText
  label: string
  path: string
}

interface RecentChat {
  id: string
  title: string
  preview: string
  time: string
  icon: typeof FileText
}

const quickActions: QuickAction[] = [
  { icon: FileText, label: '文档助手', path: '/pages/chat/index' },
  { icon: Calendar, label: '日程安排', path: '/pages/chat/index' },
  { icon: Mail, label: '邮件处理', path: '/pages/chat/index' },
  { icon: Search, label: '知识检索', path: '/pages/chat/index' },
]

const recentChats: RecentChat[] = [
  {
    id: '1',
    title: '项目进度汇报',
    preview: '帮我整理一下本周项目的完成情况和下周计划...',
    time: '今天 14:30',
    icon: MessageCircle
  },
  {
    id: '2',
    title: '代码问题排查',
    preview: '这段 Python 代码为什么运行报错？请帮我分析原因...',
    time: '昨天 16:45',
    icon: FileText
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
    <View className="min-h-screen bg-background pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {/* 欢迎区域 */}
      <View className="px-4 pt-6 pb-4">
        <View className="flex items-center gap-3 mb-4">
          <View className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
            <Bot size={24} color="#1E40AF" />
          </View>
          <View>
            <Text className="block text-lg font-semibold text-on-surface">您好，小初</Text>
            <Text className="block text-sm text-on-surface-variant">有什么可以帮您的？</Text>
          </View>
        </View>
      </View>

      {/* 快捷入口 */}
      <View className="px-4 mb-6">
        <Text className="block text-xs font-medium text-on-surface-variant mb-3 uppercase tracking-wide">快捷入口</Text>
        <View className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <View
              key={index}
              className="flex flex-col items-center gap-2 p-3 bg-surface rounded-xl shadow-card active:bg-surface-container"
              onClick={() => handleQuickAction(action.path)}
            >
              <View className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                <action.icon size={20} color="#1E40AF" />
              </View>
              <Text className="text-xs font-medium text-on-surface">{action.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 最近对话 */}
      <View className="px-4 mb-6">
        <Text className="block text-xs font-medium text-on-surface-variant mb-3 uppercase tracking-wide">最近对话</Text>
        <View className="space-y-3">
          {recentChats.map((chat) => (
            <View
              key={chat.id}
              className="block p-4 bg-surface rounded-xl shadow-card active:bg-surface-container"
              onClick={handleRecentChat}
            >
              <View className="flex items-start gap-3">
                <View className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center flex-shrink-0">
                  <chat.icon size={20} color="#1E40AF" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="block text-sm font-medium text-on-surface truncate">{chat.title}</Text>
                  <Text className="block text-xs text-on-surface-variant mt-1 truncate">{chat.preview}</Text>
                </View>
              </View>
              <View className="flex items-center justify-between mt-3">
                <Text className="text-xs text-on-surface-variant">{chat.time}</Text>
                <View className="flex items-center gap-1">
                  <CornerUpRight size={12} color="#64748B" />
                  <Text className="text-xs text-on-surface-variant">继续对话</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 新建对话按钮 */}
      <View className="px-4 pb-6">
        <View
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary rounded-xl active:bg-primary"
          onClick={handleNewChat}
        >
          <Plus size={20} color="#ffffff" />
          <Text className="text-sm font-medium text-white">新建对话</Text>
        </View>
      </View>
    </View>
  )
}
