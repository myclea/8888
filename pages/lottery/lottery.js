Page({
  data: {
    isDrawing: false,           // 是否正在抽签
    bubbleText: "不知道选什么？来抽个签吧！",  // 气泡文字
    flashingCards: [],          // 闪烁的卡片索引数组
    radius: 120, // 扇形半径，略大
    cards: [],   // 卡片数据
    selectedCardIndex: -1, // 选中的卡片索引
    showTutorialButton: false, // 是否显示教程按钮
    selectedBreadId: null, // 选中的面包ID
    breads: [
      { id: 1, name: "巧克力可颂", desc: "香甜酥脆，浓郁巧克力", img: "/images/chocolate-croissant.png", bgClass: "yellow" },
      { id: 2, name: "草莓碱水包", desc: "粉嫩可爱，香甜滋味", img: "/images/strawberry-pretzel.png", bgClass: "pink" },
      { id: 3, name: "开心果奶油卷", desc: "清香开心果，丰富层次", img: "/images/pistachio-cream-roll.png", bgClass: "green" },
      { id: 4, name: "蒜香草本法棍", desc: "香草蒜香，外酥内软", img: "/images/garlic-herb-baguette.png", bgClass: "yellow" },
      { id: 5, name: "海盐可颂", desc: "甜咸平衡，层次丰富", img: "/images/sea-salt-croissant.png", bgClass: "pink" },
      { id: 6, name: "全麦贝果", desc: "健康粗粮，嚼劲十足", img: "/images/whole-wheat-bagel.png", bgClass: "brown" },
      { id: 7, name: "蔓越莓奶油贝果", desc: "酸甜莓果，奶香浓郁", img: "/images/cranberry-cream-bagel.png", bgClass: "pink" }
    ]
  },

  onLoad() {
    // 7张卡牌，扇形展开，下缘对齐
    const totalAngle = 90;
    const startAngle = -45;
    const cards = [];
    for (let i = 0; i < 7; i++) {
      cards.push({
        angle: startAngle + i * (totalAngle / (7 - 1)),
        zIndex: i === 3 ? 10 : (i === 2 || i === 4 ? 8 : (i === 1 || i === 5 ? 6 : 4)),
        scale: i === 3 ? 1.08 : 1,
        img: '/images/card-back.png', // 卡牌图片路径
        animation: {} // 初始化空动画对象
      });
    }
    this.setData({ cards });
  },

  // 开始抽签
  startDraw() {
    if (this.data.isDrawing) return;
    this.setData({ 
      isDrawing: true, 
      flashingCards: [],
      selectedCardIndex: -1,
      bubbleText: "不知道选什么？来抽个签吧！"
    });
    
    // 闪烁动画
    let flashCount = 0;
    const flashTimes = 8; // 闪烁次数
    const flashInterval = 120; // 每次闪烁间隔ms
    
    const doFlash = () => {
      // 随机高亮3~5张卡牌
      const count = Math.floor(Math.random() * 3) + 3;
      const arr = [];
      while (arr.length < count) {
        const idx = Math.floor(Math.random() * 7);
        if (!arr.includes(idx)) arr.push(idx);
      }
      this.setData({ flashingCards: arr });
      flashCount++;
      
      if (flashCount < flashTimes) {
        setTimeout(doFlash, flashInterval);
      } else {
        // 闪烁结束，选择一张卡片
        this.selectFinalCard();
      }
    };
    
    doFlash();
  },
  
  // 选择最终的卡片
  selectFinalCard() {
    // 随机选择一张卡片
    const selectedIndex = Math.floor(Math.random() * 7);
    
    // 更新状态
    this.setData({ 
      flashingCards: [selectedIndex],
      selectedCardIndex: selectedIndex,
      bubbleText: "恭喜你抽到了一款美味面包！"
    });
    
    // 等待一秒后开始翻转动画
    setTimeout(() => {
      // 创建卡片翻转动画
      const animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      });
      
      // 翻转动画第一阶段 - 翻转到90度
      animation.rotateY(90).scale(1.2).step();
      
      // 应用动画到选中卡片
      let animationData = {};
      animationData[`cards[${selectedIndex}].animation`] = animation.export();
      this.setData(animationData);
      
      // 在翻转到90度时更换卡片图片
      setTimeout(() => {
        const cards = [...this.data.cards];
        const selectedBread = this.data.breads[selectedIndex];
        
        // 更新选中卡片的图片
        cards[selectedIndex].img = selectedBread.img;
        
        // 翻转动画第二阶段 - 翻转回0度
        animation.rotateY(0).scale(1.1).step();
        
        // 应用动画和更新图片
        animationData = {};
        animationData[`cards[${selectedIndex}].animation`] = animation.export();
        
        this.setData({ 
          cards: cards,
          bubbleText: `恭喜你抽到了「${selectedBread.name}」！`,
          selectedBreadId: selectedBread.id,
          ...animationData
        });
        
        // 等待动画完成后显示教程按钮
        setTimeout(() => {
          this.setData({
            showTutorialButton: true
          });
        }, 500);
        
        // 等待一段时间后跳转到结果页
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/result/result?breadId=${selectedBread.id}`
          });
          
          // 重置状态
          setTimeout(() => {
            cards[selectedIndex].img = '/images/card-back.png';
            this.setData({
              cards: cards,
              isDrawing: false,
              flashingCards: [],
              selectedCardIndex: -1,
              showTutorialButton: false,
              selectedBreadId: null,
              bubbleText: "不知道选什么？来抽个签吧！"
            });
          }, 500);
        }, 1500);
      }, 500);
    }, 1000);
  },
  
  // 跳转到教程页面
  gotoTutorial() {
    // 阻止事件冒泡
    if (!this.data.selectedBreadId) return;
    
    const selectedBread = this.data.breads.find(bread => bread.id === this.data.selectedBreadId);
    if (selectedBread) {
      // 保存选中的面包名称到本地存储
      wx.setStorageSync('selectedBread', selectedBread.name);
      // 设置标记，表明是从结果页跳转过来
      wx.setStorageSync('fromCollection', true);
      
      // 跳转到教程页面
      wx.switchTab({
        url: '/pages/tutorial/tutorial'
      });
    }
  }
}); 