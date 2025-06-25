Page({
  data: {
    breads: [
      { id: 1, name: "巧克力可颂", desc: "香甜酥脆，浓郁巧克力", img: "/images/chocolate-croissant.png", bgClass: "yellow" },
      { id: 2, name: "草莓碱水包", desc: "粉嫩可爱，香甜滋味", img: "/images/strawberry-pretzel.png", bgClass: "pink" },
      { id: 3, name: "开心果奶油卷", desc: "清香开心果，丰富层次", img: "/images/pistachio-cream-roll.png", bgClass: "green" },
      { id: 4, name: "蒜香草本法棍", desc: "香草蒜香，外酥内软", img: "/images/garlic-herb-baguette.png", bgClass: "yellow" },
      { id: 5, name: "海盐可颂", desc: "甜咸平衡，层次丰富", img: "/images/sea-salt-croissant.png", bgClass: "pink" },
      { id: 6, name: "全麦贝果", desc: "健康粗粮，嚼劲十足", img: "/images/whole-wheat-bagel.png", bgClass: "brown" },
      { id: 7, name: "蔓越莓奶油贝果", desc: "酸甜莓果，奶香浓郁", img: "/images/cranberry-cream-bagel.png", bgClass: "pink" }
    ],
    selectedBreads: [],
    favs: wx.getStorageSync('favs') || []
  },
  
  onLoad(options) {
    // 如果有传入面包ID，则只显示该面包
    if (options && options.breadId) {
      const breadId = parseInt(options.breadId);
      const selectedBread = this.data.breads.find(bread => bread.id === breadId);
      
      if (selectedBread) {
        this.setData({
          selectedBreads: [selectedBread]
        });
      } else {
        // 如果没有找到对应的面包，显示随机3个
        this.showRandomBreads();
      }
    } else {
      // 如果没有传入面包ID，显示随机3个
      this.showRandomBreads();
    }
  },
  
  // 显示随机3个面包
  showRandomBreads() {
    const shuffled = [...this.data.breads].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    this.setData({
      selectedBreads: selected
    });
  },
  
  isFav(id) {
    return this.data.favs.includes(id)
  },
  
  toggleFav(e) {
    const id = e.currentTarget.dataset.id
    let favs = this.data.favs
    if (favs.includes(id)) favs = favs.filter(fid => fid !== id)
    else favs.push(id)
    this.setData({ favs })
    wx.setStorageSync('favs', favs)
  },
  
  gotoTutorial(e) {
    const breadId = e.currentTarget.dataset.id;
    const selectedBread = this.data.breads.find(bread => bread.id === breadId);
    
    if (selectedBread) {
      // 保存选中的面包名称到本地存储
      wx.setStorageSync('selectedBread', selectedBread.name);
      // 设置标记，表明是从结果页跳转过来
      wx.setStorageSync('fromCollection', true);
      
      // 跳转到教程页面
      wx.switchTab({
        url: '/pages/tutorial/tutorial'
      });
    } else {
      wx.switchTab({ url: '/pages/tutorial/tutorial' });
    }
  },
  
  drawAgain() {
    wx.switchTab({ url: '/pages/lottery/lottery' })
  }
}) 