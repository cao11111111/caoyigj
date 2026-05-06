import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { FileText, Code, CircleQuestionMark, ChartBarBig, MessageCircle } from 'lucide-react-taro'

interface Conversation {
  id: string
  title: string
  preview: string
  time: string
  messageCount: number
  icon: typeof FileText
  dateGroup: string
}

const conversations: Conversation[] = [
  {
    id: '1',
    title: '项目进度汇报',
    preview: '帮我整理一下本周项目的完成情况和下周计划...',
    time: '14:30',
    messageCount: 12,
    icon: FileText,
    dateGroup: '今天'
  },
  {
    id: '2',
    title: '人事政策咨询',
    preview: '请问年假是怎么计算的？',
    time: '11:20',
    messageCount: 5,
    icon: CircleQuestionMark,
    dateGroup: '今天'
  },
  {
    id: '3',
    title: '代码问题排查',
    preview: '这段 Python 代码为什么运行报错？请帮我分析原因...',
    time: '16:45',
    messageCount: 8,
    icon: Code,
    dateGroup: '昨天'
  },
  {
    id: '4',
    title: '数据分析需求',
    preview: '帮我生成上个月的销售数据报表...',
    time: '10:30',
    messageCount: 15,
    icon: ChartBarBig,
    dateGroup: '昨天'
  },
]

export default function History() {
  const handleChat = () => {
    Taro.navigateTo({ url: '/pages/chat/index' })
  }

  // Group conversations by date
  const groupedData = conversations.reduce((acc, conv) => {
    if (!acc[conv.dateGroup]) {
      acc[conv.dateGroup] = []
    }
    acc[conv.dateGroup].push(conv)
    return acc
  }, {} as Record<string, Conversation[]>)

  return (
    <View className="min-h-screen bg-background pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {/* Conversation List */}
      <View className="px-4 py-4 space-y-4">
        {Object.entries(groupedData).map(([dateGroup, items]) => (
          <View key={dateGroup}>
            <Text className="block text-xs font-medium text-on-surface-variant mb-3">{dateGroup}</Text>
            <View className="space-y-3">
              {items.map((conv) => (
                <View
                  key={conv.id}
                  className="p-4 bg-surface rounded-xl shadow-card active:bg-surface-container"
                  onClick={handleChat}
                >
                  <View className="flex items-start justify-between">
                    <View className="flex items-center gap-3 flex-1">
                      <View className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center flex-shrink-0">
                        <conv.icon size={20} color="#1E40AF" />
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text className="block text-sm font-medium text-on-surface">{conv.title}</Text>
                        <Text className="block text-xs text-on-surface-variant mt-1 truncate">{conv.preview}</Text>
                      </View>
                    </View>
                    <Text className="text-xs text-on-surface-variant ml-2">{conv.time}</Text>
                  </View>
                  <View className="flex items-center gap-4 mt-3 pt-3 border-t border-outline">
                    <View className="flex items-center gap-1">
                      <MessageCircle size={12} color="#64748B" />
                      <Text className="text-xs text-on-surface-variant">{conv.messageCount} 条消息</Text>
                    </View>
                    <Text className="text-xs text-primary">继续对话</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
