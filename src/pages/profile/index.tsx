import { View, Text } from '@tarojs/components'
import { MessageSquare, Star, Clock, ChevronRight, LogOut, User, Settings, Bell, CircleQuestionMark, Info } from 'lucide-react-taro'
import './index.config'

interface MenuItem {
  icon: typeof User
  title: string
  value?: string
  showArrow?: boolean
}

interface MenuGroup {
  title?: string
  items: MenuItem[]
}

const MenuIcon = ({ Icon, color = '#2563eb' }: { Icon: typeof User; color?: string }) => (
  <View className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mr-3">
    <Icon size={18} color={color} />
  </View>
)

export default function Profile() {
  const menuGroups: MenuGroup[] = [
    {
      items: [
        { icon: MessageSquare, title: '对话次数', value: '126 次' },
        { icon: Star, title: '收藏助手', value: '8 个' },
        { icon: Clock, title: '使用时长', value: '约 15 小时' },
      ]
    },
    {
      title: '通用设置',
      items: [
        { icon: User, title: '个人资料', showArrow: true },
        { icon: Settings, title: '账号安全', showArrow: true },
        { icon: Bell, title: '通知设置', showArrow: true },
      ]
    },
    {
      title: '其他',
      items: [
        { icon: CircleQuestionMark, title: '帮助与反馈', showArrow: true },
        { icon: Info, title: '关于我们', showArrow: true },
      ]
    }
  ]

  return (
    <View className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <View className="bg-blue-500 px-4 pt-12 pb-8">
        <View className="flex items-center">
          <View className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4">
            <Text className="text-blue-500 text-xl font-semibold">王</Text>
          </View>
          <View>
            <Text className="block text-white text-lg font-semibold">王小明</Text>
            <Text className="block text-blue-100 text-sm mt-1">产品研发部</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 -mt-4">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <View className="flex justify-around">
            {[
              { label: '对话次数', value: '126' },
              { label: '收藏助手', value: '8' },
              { label: '使用时长', value: '15h' },
            ].map((stat, index) => (
              <View key={index} className="text-center">
                <Text className="block text-blue-500 text-xl font-semibold">{stat.value}</Text>
                <Text className="block text-slate-500 text-xs mt-1">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Menu */}
      <View className="px-4 mt-5">
        {menuGroups.map((group, groupIndex) => (
          <View key={groupIndex} className="mb-4">
            {group.title && (
              <Text className="block text-slate-500 text-xs font-medium uppercase tracking-wide mb-2 ml-1">
                {group.title}
              </Text>
            )}
            <View className="bg-white rounded-2xl overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  className={`p-4 flex items-center ${itemIndex !== group.items.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <MenuIcon Icon={item.icon} />
                  <Text className="flex-1 text-slate-800 text-sm">{item.title}</Text>
                  {item.value && (
                    <Text className="text-slate-400 text-sm mr-2">{item.value}</Text>
                  )}
                  {item.showArrow && <ChevronRight size={18} color="#cbd5e1" />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <View className="mt-6">
          <View className="bg-white rounded-2xl p-4 flex items-center justify-center">
            <LogOut size={18} color="#ef4444" className="mr-2" />
            <Text className="text-red-500 text-sm font-medium">退出登录</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
