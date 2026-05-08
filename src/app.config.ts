export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/login/profile',
    'pages/index/index',
    'pages/history/index',
    'pages/profile/index',
    'pages/chat/index',
    'pages/knowledge-card/index',
    'pages/knowledge-card/result'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FAFCFF',
    navigationBarTitleText: '智能助手',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#64748B',
    selectedColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '智能体',
        iconPath: './assets/tabbar/message-circle.png',
        selectedIconPath: './assets/tabbar/message-circle-active.png'
      },
      {
        pagePath: 'pages/history/index',
        text: '历史',
        iconPath: './assets/tabbar/clock.png',
        selectedIconPath: './assets/tabbar/clock-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
