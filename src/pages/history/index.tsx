import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { FileText, Code, CircleQuestionMark, ChartBarBig, MessageCircle, ChevronRight, Clock } from 'lucide-react-taro'

interface Conversation {
  id: string
  title: string
  preview: string
  time: string
  messageCount: number
  icon: typeof FileText
  iconBg: string
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
    iconBg: 'bg-gradient-to-br from-indigo-100 to-indigo-50',
    dateGroup: '今天'
  },
  {
    id: '2',
    title: '人事政策咨询',
    preview: '请问年假是怎么计算的？',
    time: '11:20',
    messageCount: 5,
    icon: CircleQuestionMark,
    iconBg: 'bg-gradient-to-br from-green-100 to-emerald-50',
    dateGroup: '今天'
  },
  {
    id: '3',
    title: '代码问题排查',
    preview: '这段 Python 代码为什么运行报错？请帮我分析原因...',
    time: '16:45',
    messageCount: 8,
    icon: Code,
    iconBg: 'bg-gradient-to-br from-purple-100 to-purple-50',
    dateGroup: '昨天'
  },
  {
    id: '4',
    title: '数据分析需求',
    preview: '帮我生成上个月的销售数据报表...',
    time: '10:30',
    messageCount: 15,
    icon: ChartBarBig,
    iconBg: 'bg-gradient-to-br from-amber-100 to-orange-50',
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
    <View className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50 pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {/* Header */}
      <View className="px-5 pt-8 pb-4">
        <View className="flex items-center gap-3">
          <Clock size={24} color="#6366f1" />
          <Text className="text-xl font-bold text-slate-800">对话历史</Text>
        </View>
        <Text className="block text-sm text-slate-500 mt-1">共 {conversations.length} 条对话记录</Text>
      </View>

      {/* Conversation List */}
      <View className="px-5 space-y-6">
        {Object.entries(groupedData).map(([dateGroup, items]) => (
          <View key={dateGroup}>
            <View className="flex items-center gap-2 mb-3">
              <View className="w-2 h-2 rounded-full bg-indigo-400" />
              <Text className="text-sm font-semibold text-slate-600">{dateGroup}</Text>
            </View>
            <View className="space-y-3">
              {items.map((conv) => (
                <View
                  key={conv.id}
                  className="bg-white rounded-2xl p-4 shadow-sm active:bg-slate-50 transition-colors"
                  onClick={handleChat}
                >
                  <View className="flex items-start gap-3">
                    <View className={`w-12 h-12 rounded-xl ${conv.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <conv.icon size={22} color="#6366f1" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <View className="flex items-start justify-between gap-2">
                        <Text className="block text-sm font-semibold text-slate-800">{conv.title}</Text>
                        <Text className="text-xs text-slate-400 flex-shrink-0">{conv.time}</Text>
                      </View>
                      <Text className="block text-xs text-slate-500 mt-1 truncate">{conv.preview}</Text>
                      <View className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                        <View className="flex items-center gap-1">
                          <MessageCircle size={12} color="#94a3b8" />
                          <Text className="text-xs text-slate-400">{conv.messageCount} 条消息</Text>
                        </View>
                        <View className="flex items-center gap-1 text-indigo-500">
                          <Text className="text-xs font-medium">继续对话</Text>
                          <ChevronRight size={12} color="#6366f1" />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
      
      <View className="h-8" />
    </View>
  )
}
