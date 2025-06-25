Page({
  data: {
    userInfo: {
      nickname: "面包爱好者",
      avatar: "/images/bread-character.png"
    },
    stats: [
      { label: "收藏面包", value: 0 },
      { label: "浏览记录", value: 15 },
      { label: "制作次数", value: 8 }
    ],
    favorites: [],
    recent: [
      { id: 1, emoji: "🍞", name: "巧克力面包" },
      { id: 2, emoji: "🥖", name: "法式长棍" },
      { id: 3, emoji: "🍞", name: "抹茶面包" }
    ]
  },
  
  onLoad() {
    this.loadFavorites();
  },
  
  onShow() {
    // 每次页面显示时刷新收藏列表
    this.loadFavorites();
  },
  
  loadFavorites() {
    const app = getApp();
    const favoriteIds = app.globalData.favorites || [];
    
    const favorites = [];
    favoriteIds.forEach(id => {
      const breadName = app.getBreadNameById(id);
      if (breadName) {
        // 为每种面包选择一个合适的emoji
        let emoji = "🍞"; // 默认
        if (breadName.includes("法棍") || breadName.includes("长棍")) {
          emoji = "🥖";
        } else if (breadName.includes("可颂") || breadName.includes("羊角")) {
          emoji = "🥐";
        } else if (breadName.includes("甜") || breadName.includes("巧克力") || breadName.includes("奶油")) {
          emoji = "🍩";
        } else if (breadName.includes("海盐") || breadName.includes("碱水")) {
          emoji = "🥨";
        }
        
        favorites.push({ id, emoji, name: breadName });
      }
    });
    
    this.setData({ 
      favorites,
      'stats[0].value': favorites.length 
    });
  },
  
  // 跳转到面包教程
  gotoTutorial(e) {
    const breadId = e.currentTarget.dataset.id;
    const app = getApp();
    const breadName = app.getBreadNameById(breadId);
    
    if (breadName) {
      // 保存选中的面包到全局
      app.globalData.selectedBread = breadName;
      
      // 跳转到教程页并传递面包名称
      wx.switchTab({
        url: '/pages/tutorial/tutorial',
        success: () => {
          // 设置一个标识，表示从个人页跳转
          wx.setStorageSync('fromCollection', true);
          wx.setStorageSync('selectedBread', breadName);
        }
      });
    }
  },
  
  // 移除收藏
  removeFavorite(e) {
    const breadId = e.currentTarget.dataset.id;
    const app = getApp();
    
    // 移除收藏
    app.toggleFavorite(breadId);
    
    // 重新加载收藏列表
    this.loadFavorites();
    
    // 显示提示
    wx.showToast({
      title: '已取消收藏',
      icon: 'success',
      duration: 1500
    });
  }
}) 