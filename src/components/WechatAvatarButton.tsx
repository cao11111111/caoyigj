import { View, Text, Image } from '@tarojs/components'

// 微信头像选择按钮组件 - 单独文件避免类型检查问题
export function WechatAvatarButton({ 
  avatar, 
  agreePrivacy, 
  loading, 
  onAvatarChange 
}: { 
  avatar: string
  agreePrivacy: boolean
  loading: boolean
  onAvatarChange: (url: string) => void 
}) {
  const handleChooseAvatar = (e: any) => {
    const { avatarUrl } = e.detail
    onAvatarChange(avatarUrl)
  }
  
  // 使用原生 button，小程序环境编译
  const buttonProps: Record<string, any> = {
    'open-type': 'chooseAvatar',
    onChooseavatar: handleChooseAvatar,
    className: `w-full h-12 rounded-full mb-3 flex items-center justify-center ${agreePrivacy ? 'bg-green-500' : 'bg-gray-300'}`,
    disabled: !agreePrivacy || loading
  }
  
  return (
    <View>
      {/* @ts-ignore */}
      <button {...buttonProps}>
        <View className="flex flex-row items-center justify-center">
          {avatar ? (
            <Image src={avatar} className="w-8 h-8 rounded-full mr-2" mode="aspectFill" />
          ) : null}
          <Text className={`text-base font-medium ${agreePrivacy ? 'text-white' : 'text-gray-500'}`}>
            {avatar ? '头像已选择' : '点击选择微信头像'}
          </Text>
        </View>
      </button>
    </View>
  )
}
