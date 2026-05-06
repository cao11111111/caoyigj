import { View, Text } from '@tarojs/components'
import { Star, Settings, CircleQuestionMark, Info, ChevronRight, User, Sparkles } from 'lucide-react-taro'

interface MenuItem {
  icon: typeof Star
  title: string
  subtitle: string
  gradient: string
  path: string
}

interface StatItem {
  value: string
  label: string
  color: string
}

const menuItems: MenuItem[] = [
  { icon: Star, title: '我的收藏', subtitle: '查看收藏的内容', gradient: 'bg-gradient-to-br from-amber-400 to-orange-500', path: '' },
  { icon: Settings, title: '设置', subtitle: '个性化配置', gradient: 'bg-gradient-to-br from-slate-500 to-slate-600', path: '' },
  { icon: CircleQuestionMark, title: '帮助与反馈', subtitle: '常见问题与建议', gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500', path: '' },
  { icon: Info, title: '关于', subtitle: '版本 1.0.0', gradient: 'bg-gradient-to-br from-violet-500 to-purple-500', path: '' },
]

const stats: StatItem[] = [
  { value: '86', label: '对话次数', color: 'text-indigo-600' },
  { value: '12', label: '收藏内容', color: 'text-amber-500' },
  { value: '5', label: '使用天数', color: 'text-emerald-500' },
]

export default function Profile() {
  return (
    <View className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50 pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {/* Header */}
      <View className="relative px-5 pt-8 pb-6">
        {/* 装饰背景 */}
        <View className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200 via-indigo-200 to-pink-200 rounded-full opacity-40 blur-3xl" />
        
        <View className="relative">
          {/* 用户信息卡片 */}
          <View className="flex items-center gap-4 p-5 bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-sm border border-white">
            <View className="w-18 h-18 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Text className="text-2xl font-bold text-white">初</Text>
            </View>
            <View className="flex-1">
              <Text className="block text-xl font-bold text-slate-800">小初</Text>
              <View className="flex items-center gap-2 mt-1">
                <User size={12} color="#94a3b8" />
                <Text className="text-sm text-slate-500">产品研发部 · 产品经理</Text>
              </View>
            </View>
            <View className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Sparkles size={16} color="#6366f1" />
            </View>
          </View>
        </View>
      </View>

      {/* 统计信息 */}
      <View className="px-5 mb-6">
        <View className="bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white">
          <View className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <View key={index} className="text-center">
                <Text className={`block text-2xl font-bold ${stat.color}`}>{stat.value}</Text>
                <Text className="block text-xs text-slate-500 mt-1">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 功能列表 */}
      <View className="px-5 space-y-3">
        <Text className="block text-sm font-semibold text-slate-600 mb-2 px-1">更多功能</Text>
        {menuItems.map((item, index) => (
          <View
            key={index}
            className="flex items-center gap-4 p-4 bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-sm border border-white active:bg-white transition-colors"
          >
            <View className={`w-11 h-11 rounded-xl ${item.gradient} flex items-center justify-center shadow-md`}>
              <item.icon size={20} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="block text-sm font-semibold text-slate-800">{item.title}</Text>
              <Text className="block text-xs text-slate-500">{item.subtitle}</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </View>
        ))}
      </View>
      
      <View className="h-8" />
    </View>
  )
}
