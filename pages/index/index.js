const app = getApp()

Page({
  data: {
    // 页面数据
  },

  onLoad: function (options) {
    console.log("Index页面加载")

    // 检查是否是首次启动
    const hasVisited = wx.getStorageSync("hasVisited")
    if (!hasVisited) {
      // 首次访问，显示欢迎动画
      this.showWelcomeAnimation()
      wx.setStorageSync("hasVisited", true)
    }
  },

  onShow: () => {
    // 页面显示时的逻辑
  },

  onReady: () => {
    // 页面初次渲染完成
  },

  onHide: () => {
    // 页面隐藏
  },

  onUnload: () => {
    // 页面卸载
  },

  // 显示欢迎动画
  showWelcomeAnimation: () => {
    // 可以在这里添加一些欢迎动画逻辑
    wx.showToast({
      title: "欢迎使用面包脑袋！",
      icon: "none",
      duration: 2000,
    })
  },

  // 开始使用应用
  startApp: () => {
    // 添加触觉反馈
    wx.vibrateShort({
      type: "light",
    })

    // 显示加载提示
    wx.showLoading({
      title: "正在进入...",
      mask: true,
    })

    // 延迟跳转，增加用户体验
    setTimeout(() => {
      wx.hideLoading()

      // 跳转到抽签页（主功能页面）
      wx.switchTab({
        url: "/pages/lottery/lottery",
        success: () => {
          console.log("成功跳转到抽签页")
        },
        fail: (err) => {
          console.error("跳转失败:", err)
          wx.showToast({
            title: "跳转失败，请重试",
            icon: "none",
          })
        },
      })
    }, 800)
  },

  // 页面分享
  onShareAppMessage: () => ({
    title: "面包脑袋 - 你的面包制作小助手",
    path: "/pages/index/index",
    imageUrl: "/images/bread-character.png",
  }),

  // 分享到朋友圈
  onShareTimeline: () => ({
    title: "面包脑袋 - 选、学、吃全搞定！",
    imageUrl: "/images/bread-character.png",
  }),

  // 页面滚动
  onPageScroll: (e) => {
    // 可以根据滚动位置添加一些动画效果
  },

  // 下拉刷新
  onPullDownRefresh: () => {
    // 模拟刷新
    setTimeout(() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: "刷新完成",
        icon: "success",
        duration: 1000,
      })
    }, 1000)
  },

  // 上拉加载
  onReachBottom: () => {
    // 首页通常不需要上拉加载
  },

  // 用户点击右上角分享
  onShareAppMessage: () => ({
    title: "面包脑袋 - 你的面包制作小助手",
    path: "/pages/index/index",
    imageUrl: "/images/bread-character.png",
  }),
})
