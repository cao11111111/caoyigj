export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '对话历史' })
  : { navigationBarTitleText: '对话历史' }
