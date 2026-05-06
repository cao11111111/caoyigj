export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '对话详情' })
  : { navigationBarTitleText: '对话详情' }
