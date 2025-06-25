const allBreads = [
  // 法式面包
  { id: 1, name: "蒜香法棍", desc: "香蒜调味，外酥内软，经典法式风味", img: "/images/garlic-herb-baguette.png", category: "法式面包" },
  { id: 2, name: "海盐可颂", desc: "海盐提味，层次丰富，每一层都有惊喜", img: "/images/sea-salt-croissant.png", category: "法式面包" },
  { id: 3, name: "橙香巧克力法棍", desc: "橙皮香气配巧克力，酸甜与苦香的完美融合", img: "/images/orange-chocolate-baguette.jpg", category: "法式面包" },
  
  // 碱水面包
  { id: 4, name: "芝麻碱水包", desc: "外层香脆，内部柔软，芝麻香气四溢", img: "/images/sesame-pretzel.jpg", category: "碱水面包" },
  { id: 5, name: "蓝莓碱水卷", desc: "加入蓝莓的创新碱水面包，甜蜜与咸香的结合", img: "/images/blueberry-pretzel-roll.jpg", category: "碱水面包" },
  { id: 6, name: "传统德式碱水结", desc: "经典造型，口感绝佳的德式碱水结", img: "/images/traditional-pretzel.jpg", category: "碱水面包" },
  
  // 日式面包
  { id: 7, name: "抹茶红豆包", desc: "日式经典，抹茶清香与红豆甜蜜的完美结合", img: "/images/matcha-azuki-bread.jpg", category: "日式面包" },
  { id: 8, name: "北海道牛奶面包", desc: "柔软如云朵，浓郁的奶香让人无法抗拒", img: "/images/hokkaido-milk-bread.jpg", category: "日式面包" },
  { id: 9, name: "黑芝麻夹心面包", desc: "黑芝麻香气十足，松软的口感回味无穷", img: "/images/black-sesame-bread.jpg", category: "日式面包" },
  
  // 欧式面包
  { id: 10, name: "经典乡村面包", desc: "外皮酥脆，内部松软，完美的酸度平衡", img: "/images/rustic-country-bread.jpg", category: "欧式面包" },
  { id: 11, name: "核桃葡萄干面包", desc: "丰富的口感与香气，健康美味的经典组合", img: "/images/walnut-raisin-bread.jpg", category: "欧式面包" },
  { id: 12, name: "罗勒橄榄油面包", desc: "地中海风味，香草与橄榄油的香气令人陶醉", img: "/images/basil-olive-oil-bread.jpg", category: "欧式面包" },
  
  // 中式面包
  { id: 13, name: "红豆沙面包", desc: "传统中式口味，松软面包搭配香甜红豆沙", img: "/images/red-bean-bread.jpg", category: "中式面包" },
  { id: 14, name: "香葱肉松面包", desc: "咸香可口，香葱与肉松的经典搭配", img: "/images/pork-floss-bread.jpg", category: "中式面包" },
  { id: 15, name: "椰蓉面包", desc: "椰香浓郁，甜而不腻的经典中式甜面包", img: "/images/coconut-bread.jpg", category: "中式面包" },
  
  // 热门推荐 - 来自各个分类的热门面包
  { id: 16, name: "蒜香法棍", desc: "香蒜调味，外酥内软，经典法式风味", img: "/images/garlic-herb-baguette.png", category: "热门推荐" },
  { id: 17, name: "传统德式碱水结", desc: "经典造型，口感绝佳的德式碱水结", img: "/images/traditional-pretzel.jpg", category: "热门推荐" },
  { id: 18, name: "北海道牛奶面包", desc: "柔软如云朵，浓郁的奶香让人无法抗拭", img: "/images/hokkaido-milk-bread.jpg", category: "热门推荐" },
  { id: 19, name: "经典乡村面包", desc: "外皮酥脆，内部松软，完美的酸度平衡", img: "/images/rustic-country-bread.jpg", category: "热门推荐" },
  { id: 20, name: "香葱肉松面包", desc: "咸香可口，香葱与肉松的经典搭配", img: "/images/pork-floss-bread.jpg", category: "热门推荐" }
]

Page({
  data: {
    categories: ["热门推荐", "法式面包", "碱水面包", "日式面包", "欧式面包", "中式面包"],
    selectedCategory: "热门推荐",
    searchQuery: "",
    filteredBreads: [],
    favs: []
  },
  
  onLoad() {
    // 初始化收藏列表
    const app = getApp();
    const favs = app.globalData.favorites || [];
    
    this.setData({ favs }, () => {
      this.filterBreads();
    });
  },
  
  onShow() {
    // 每次显示页面时刷新收藏状态
    const app = getApp();
    const favs = app.globalData.favorites || [];
    
    this.setData({ favs }, () => {
      this.filterBreads();
    });
  },
  
  selectCategory(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.category }, this.filterBreads);
  },
  
  onSearch(e) {
    this.setData({ searchQuery: e.detail.value }, this.filterBreads);
  },
  
  filterBreads() {
    const { selectedCategory, searchQuery } = this.data;
    let filtered = allBreads.filter(b => b.category === selectedCategory);
    
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.name.includes(searchQuery) || b.desc.includes(searchQuery)
      );
    }
    
    this.setData({ filteredBreads: filtered });
  },
  
  toggleFav(e) {
    const breadId = e.currentTarget.dataset.id;
    const app = getApp();
    
    // 使用全局方法切换收藏状态
    const newStatus = app.toggleFavorite(breadId);
    
    // 更新本地收藏状态
    this.setData({
      favs: app.globalData.favorites
    });
    
    // 显示收藏状态提示
    wx.showToast({
      title: newStatus ? '已加入收藏' : '已取消收藏',
      icon: 'success',
      duration: 1500
    });
  },
  
  gotoTutorial(e) {
    const breadId = e.currentTarget.dataset.id;
    const breadItem = allBreads.find(b => b.id === breadId);
    
    if (!breadItem) return;
    
    // 首先设置本地存储标志
    wx.setStorageSync('selectedBread', breadItem.name);
    wx.setStorageSync('fromCollection', true);
    
    // 通知用户
    wx.showToast({
      title: '正在查询食谱...',
      icon: 'loading',
      duration: 1000
    });
    
    // 然后跳转到教程页
    wx.switchTab({
      url: '/pages/tutorial/tutorial'
    });
  }
}) 