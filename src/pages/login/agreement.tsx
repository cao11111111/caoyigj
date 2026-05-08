import { View, Text, ScrollView } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'

const serviceAgreement = `
用户服务协议

一、服务条款的确认和接受
1. 本协议是用户与"曹一工具箱"应用（以下简称"本应用"）之间关于使用本应用服务所订立的协议。
2. 用户在使用本应用服务前，应仔细阅读本协议。用户使用本应用服务即表示用户同意接受本协议的全部条款。
3. 本应用有权随时修改本协议条款，修改后的协议一经公布即生效。

二、服务内容
1. 本应用提供知识卡片生成、历史记录查看等功能。
2. 本应用保留随时变更或中断服务的权利。

三、用户账号
1. 用户可通过账号登录或微信授权登录使用本应用。
2. 用户应妥善保管账号信息，因个人原因导致账号被盗用，责任自负。

四、知识产权
1. 本应用的所有内容，包括但不限于文字、图片、标识等，均受知识产权保护。
2. 用户在使用本应用服务时产生的相关内容，知识产权归属用户。

五、隐私保护
1. 本应用非常重视用户隐私保护，详细内容请参阅《隐私政策》。
2. 本应用会采取合理的安全措施保护用户个人信息。

六、免责声明
1. 本应用不对用户因使用服务而导致的任何直接或间接损失承担责任。
2. 用户因违反本协议导致的任何后果，由用户自行承担。

七、协议修改
本应用有权随时修改本协议，修改后的协议将在本应用内公布。
`

const privacyPolicy = `
隐私政策

一、信息收集
1. 本应用收集用户主动提供的信息，如账号、密码等。
2. 本应用收集用户使用过程中产生的信息，如操作记录、使用偏好等。

二、信息使用
1. 本应用使用收集的信息提供和改进服务。
2. 本应用不会将用户个人信息出售给第三方。

三、信息共享
除以下情况外，本应用不会与第三方共享用户信息：
1. 获得用户明确同意后。
2. 根据法律法规要求必须提供。

四、信息安全
1. 本应用采取合理的安全措施保护用户信息。
2. 本应用承诺尽全力保护用户信息安全。

五、用户权利
用户有权：
1. 访问自己的个人信息。
2. 更正不准确的个人信息。
3. 删除自己的个人信息。

六、Cookie使用
本应用可能使用Cookie技术改善用户体验，用户可选择禁用Cookie。

七、未成年人保护
本应用非常重视对未成年人信息的保护，未成年人应在监护人陪同下使用本应用。

八、隐私政策更新
本应用可能会不时更新隐私政策，更新后的政策将在本应用内公布。
`

export default function AgreementPage() {
  const router = useRouter()
  const type = router.params.type || 'service'

  const title = type === 'service' ? '用户服务协议' : '隐私政策'
  const content = type === 'service' ? serviceAgreement : privacyPolicy

  return (
    <ScrollView className="min-h-screen bg-white px-6 py-6">
      <Text className="block text-2xl font-bold text-gray-800 mb-6">{title}</Text>
      <View className="mb-8">
        {content.split('\n').map((line, index) => {
          if (!line.trim()) return null
          const isMainTitle = /^[零一二三四五六七八九十]+、/.test(line) || /^[一二三四五六七八九十]+、/.test(line) || /^[0-9]+[.、]/.test(line)
          const isSubTitle = /^（[一二三四五六七八九十]+）/.test(line) || /^[0-9]+[.、]/.test(line)
          
          if (isMainTitle) {
            return (
              <Text key={index} className="block text-base font-bold text-gray-700 mt-6 mb-2">{line}</Text>
            )
          }
          if (isSubTitle) {
            return (
              <Text key={index} className="block text-sm font-medium text-gray-600 mt-3 mb-1">{line}</Text>
            )
          }
          return (
            <Text key={index} className="block text-sm text-gray-600 leading-6 mb-1">{line}</Text>
          )
        })}
      </View>
    </ScrollView>
  )
}
