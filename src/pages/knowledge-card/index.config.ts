export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '知识卡片' })
  : { navigationBarTitleText: '知识卡片' }
