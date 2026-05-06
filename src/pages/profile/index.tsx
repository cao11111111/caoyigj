import { View, Text } from '@tarojs/components'
import { Star, Settings, CircleQuestionMark, Info, ChevronRight } from 'lucide-react-taro'

interface MenuItem {
  icon: typeof Star
  title: string
  subtitle: string
  path: string
}

const menuItems: MenuItem[] = [
  { icon: Star, title: '我的收藏', subtitle: '查看收藏的内容', path: '' },
  { icon: Settings, title: '设置', subtitle: '个性化配置', path: '' },
  { icon: CircleQuestionMark, title: '帮助与反馈', subtitle: '常见问题与建议', path: '' },
  { icon: Info, title: '关于', subtitle: '版本 1.0.0', path: '' },
]

export default function Profile() {
  return (
    <View className="min-h-screen bg-background pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {/* 用户信息卡片 */}
      <View className="px-4 py-6">
        <View className="flex items-center gap-4 p-4 bg-surface rounded-2xl shadow-card">
          <View className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <Text className="text-2xl font-semibold text-white">初</Text>
          </View>
          <View className="flex-1">
            <Text className="block text-lg font-semibold text-on-surface">小初</Text>
            <Text className="block text-sm text-on-surface-variant">产品研发部 · 产品经理</Text>
          </View>
          <ChevronRight size={20} color="#64748B" />
        </View>
      </View>

      {/* 统计信息 */}
      <View className="px-4 mb-6">
        <View className="grid grid-cols-3 gap-3">
          <View className="p-4 bg-surface rounded-xl text-center shadow-card">
            <Text className="block text-2xl font-bold text-primary">86</Text>
            <Text className="block text-xs text-on-surface-variant mt-1">对话次数</Text>
          </View>
          <View className="p-4 bg-surface rounded-xl text-center shadow-card">
            <Text className="block text-2xl font-bold text-primary">12</Text>
            <Text className="block text-xs text-on-surface-variant mt-1">收藏内容</Text>
          </View>
          <View className="p-4 bg-surface rounded-xl text-center shadow-card">
            <Text className="block text-2xl font-bold text-primary">5</Text>
            <Text className="block text-xs text-on-surface-variant mt-1">使用天数</Text>
          </View>
        </View>
      </View>

      {/* 功能列表 */}
      <View className="px-4 space-y-3">
        {menuItems.map((item, index) => (
          <View
            key={index}
            className="flex items-center gap-4 p-4 bg-surface rounded-xl shadow-card active:bg-surface-container"
          >
            <View className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
              <item.icon size={20} color="#1E40AF" />
            </View>
            <View className="flex-1">
              <Text className="block text-sm font-medium text-on-surface">{item.title}</Text>
              <Text className="block text-xs text-on-surface-variant">{item.subtitle}</Text>
            </View>
            <ChevronRight size={16} color="#64748B" />
          </View>
        ))}
      </View>
    </View>
  )
}
