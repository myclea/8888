App({
  globalData: {
    userInfo: null,
    favorites: [],
    selectedBread: null,
    // Moonshot API配置
    moonshotAPI: {
      baseUrl: 'https://api.moonshot.cn/v1',
      apiKey: 'sk-u2iviiOp3sdfa8b2IplKDdIcI1v2CwCbUGPeVE2KzySRwhgy'
    },
    // 面包数据字典，用于通过名称查找ID
    breadMap: {
      "蒜香法棍": 1,
      "海盐可颂": 2,
      "橙香巧克力法棍": 3,
      "芝麻碱水包": 4,
      "蓝莓碱水卷": 5,
      "传统德式碱水结": 6,
      "抹茶红豆包": 7,
      "北海道牛奶面包": 8,
      "黑芝麻夹心面包": 9,
      "经典乡村面包": 10,
      "核桃葡萄干面包": 11,
      "罗勒橄榄油面包": 12,
      "红豆沙面包": 13,
      "香葱肉松面包": 14,
      "椰蓉面包": 15
    }
  },

  onLaunch: function () {
    console.log("面包脑袋小程序启动")

    // 获取本地存储的收藏数据
    const favorites = wx.getStorageSync("favorites") || []
    this.globalData.favorites = favorites

    // 配置网络请求
    this.configNetwork()

    // 显示启动页
    setTimeout(() => {
      wx.switchTab({
        url: "/pages/lottery/lottery",
      })
    }, 3000)
  },
  
  // 配置网络请求
  configNetwork: function() {
    // 设置请求超时时间
    wx.setStorageSync('networkTimeout', {
      request: 15000,
      connectSocket: 15000,
      uploadFile: 15000,
      downloadFile: 15000
    })
    
    // 监听并处理网络状态变化
    wx.onNetworkStatusChange(function(res) {
      console.log('网络状态变化', res.isConnected)
      if (!res.isConnected) {
        wx.showToast({
          title: '网络连接已断开',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  onShow: (options) => {
    // 小程序显示时执行
  },

  onHide: () => {
    // 小程序隐藏时执行
  },

  onError: (msg) => {
    console.log(msg)
  },

  // 全局方法
  toggleFavorite: function (breadId) {
    const favorites = this.globalData.favorites
    const index = favorites.indexOf(breadId)

    if (index > -1) {
      favorites.splice(index, 1)
    } else {
      favorites.push(breadId)
    }

    this.globalData.favorites = favorites
    wx.setStorageSync("favorites", favorites)

    return favorites.includes(breadId)
  },

  isFavorite: function (breadId) {
    return this.globalData.favorites.includes(breadId)
  },
  
  // 通过名称获取面包ID
  getBreadIdByName: function(breadName) {
    return this.globalData.breadMap[breadName] || null;
  },
  
  // 通过ID获取面包名称
  getBreadNameById: function(breadId) {
    const breadMap = this.globalData.breadMap;
    for (const [name, id] of Object.entries(breadMap)) {
      if (id === breadId) {
        return name;
      }
    }
    return null;
  }
})
