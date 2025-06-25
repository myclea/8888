Page({
  data: {
    timer: null
  },
  
  onLoad() {
    // 设置自动跳转计时器，3秒后自动跳转
    this.data.timer = setTimeout(() => {
      this.navigateToMain();
    }, 3000);
  },
  
  onUnload() {
    // 页面卸载时清除计时器
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
  },
  
  // 跳过按钮点击事件
  skipSplash() {
    // 清除自动跳转计时器
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
    
    this.navigateToMain();
  },
  
  // 导航到主页面
  navigateToMain() {
    wx.switchTab({
      url: '/pages/lottery/lottery'
    });
  }
}) 