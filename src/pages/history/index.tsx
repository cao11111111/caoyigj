import { View, Text } from '@tarojs/components'
import { MessageSquare } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import './index.config'

interface ChatItem {
  id: number
  title: string
  preview: string
  time: string
  count: number
}

interface ChatGroup {
  title: string
  chats: ChatItem[]
}

export default function History() {
  const chatGroups: ChatGroup[] = [
    {
      title: '今天',
      chats: [
        { id: 1, title: '项目进度汇报模板', preview: '帮我生成一份项目进度汇报...', time: '14:30', count: 8 },
        { id: 2, title: '代码审查建议', preview: '帮我看看这段代码有什么问题...', time: '11:20', count: 5 },
      ]
    },
    {
      title: '昨天',
      chats: [
        { id: 3, title: '周报总结', preview: '这周的周报应该怎么写...', time: '18:45', count: 12 },
        { id: 4, title: '会议安排', preview: '帮我安排下周的团队会议...', time: '15:30', count: 3 },
        { id: 5, title: '文档润色', preview: '帮我优化一下这份邮件...', time: '10:00', count: 6 },
      ]
    },
    {
      title: '更早',
      chats: [
        { id: 6, title: '竞品分析', preview: '分析一下我们的主要竞品...', time: '昨天', count: 15 },
        { id: 7, title: '技术选型', preview: '新项目应该用什么技术栈...', time: '周一', count: 9 },
      ]
    }
  ]

  return (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-slate-100">
        <Text className="block text-slate-800 text-xl font-semibold">对话历史</Text>
      </View>

      {/* Chat List */}
      <View className="px-4 py-4">
        {chatGroups.map((group, groupIndex) => (
          <View key={groupIndex} className="mb-6">
            <Text className="block text-slate-500 text-xs font-medium uppercase tracking-wide mb-2 ml-1">
              {group.title}
            </Text>
            <View className="bg-white rounded-2xl overflow-hidden">
              {group.chats.map((chat, chatIndex) => (
                <View
                  key={chat.id}
                  className={`p-4 flex items-center ${chatIndex !== group.chats.length - 1 ? 'border-b border-slate-100' : ''}`}
                  onClick={() => Taro.navigateTo({ url: '/pages/chat/index' })}
                >
                  <View className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mr-3">
                    <MessageSquare size={20} color="#2563eb" />
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="block text-slate-800 text-sm font-medium truncate">{chat.title}</Text>
                    <Text className="block text-slate-400 text-xs mt-1 truncate">{chat.preview}</Text>
                  </View>
                  <View className="flex flex-col items-end ml-2">
                    <Text className="text-slate-400 text-xs">{chat.time}</Text>
                    <View className="mt-1 px-2 py-1 bg-slate-100 rounded text-slate-500">
                      <Text className="text-xs">{chat.count}条</Text>
                    </View>
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
