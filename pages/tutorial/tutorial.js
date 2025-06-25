import config from '../../utils/config';

Page({
  data: {
    messages: [],
    inputMsg: '',
    isLoading: false,
    currentBread: '',
    scrollToBottom: true,
    chocolateBread: "巧克力可颂",
    strawberryBread: "草莓碱水包",
    pistachioBread: "开心果奶油卷",
    apiKeyValid: true,
    currentModel: config.model, // 当前使用的模型
    displayModelName: '面包助手AI', // 显示的模型名称简化为面包助手AI
    modelStatus: 'ready', // ready, loading, error
    inputFocus: false, // 控制输入框焦点
    isFavorite: false // 当前面包是否已收藏
  },
  
  onLoad() {
    // 从全局获取Moonshot配置
    const app = getApp();
    if (app && app.globalData && app.globalData.moonshotAPI) {
      // 更新本地配置
      config.apiKey = app.globalData.moonshotAPI.apiKey;
      config.apiUrl = app.globalData.moonshotAPI.baseUrl + '/chat/completions';
    }
    
    // 检查API密钥是否有效
    this.checkApiKey();
    
    // 初始化欢迎消息
    this.setData({
      messages: [
        { 
          id: Date.now(), 
          type: 'bot', 
          content: '你好！我是面包小助手，可以回答你关于面包制作的任何问题。你想了解哪种面包的制作方法？',
          timeString: this.formatTime(new Date())
        }
      ]
    });
  },
  
  onShow() {
    // 检查是否从合集页面跳转过来
    const fromCollection = wx.getStorageSync('fromCollection');
    if (fromCollection) {
      // 获取选中的面包名称
      const selectedBread = wx.getStorageSync('selectedBread');
      if (selectedBread) {
        // 清除标记，防止重复触发
        wx.removeStorageSync('fromCollection');
        
        // 设置当前面包名称
        this.setData({ currentBread: selectedBread });
        
        // 检查是否已收藏
        this.checkFavoriteStatus(selectedBread);
        
        // 构建搜索请求
        const searchQuery = `请介绍${selectedBread}的制作方法，包括所需材料和详细步骤`;
        
        // 清空之前的消息，显示新的欢迎消息
        this.setData({
          messages: [
            { 
              id: Date.now(), 
              type: 'bot', 
              content: `欢迎学习${selectedBread}的制作方法！我将为您详细介绍所需材料和制作步骤。`,
              timeString: this.formatTime(new Date())
            }
          ],
          scrollToBottom: true
        });
        
        // 滚动到底部
        this.scrollToBottom();
        
        // 延迟一下再自动搜索，让用户看到欢迎消息
        setTimeout(() => {
          // 自动搜索该面包的制作方法
          this.setData({ 
            inputMsg: searchQuery,
            isLoading: true
          });
          this.getAIResponse(searchQuery);
        }, 800);
      }
    } else if (this.data.currentBread) {
      // 如果已有当前面包，刷新收藏状态
      this.checkFavoriteStatus(this.data.currentBread);
    }
  },
  
  // 检查当前面包的收藏状态
  checkFavoriteStatus(breadName) {
    const app = getApp();
    
    // 使用app的方法查找ID
    const breadId = app.getBreadIdByName(breadName);
    if (breadId) {
      const isFavorite = app.isFavorite(breadId);
      this.setData({ isFavorite });
    }
  },
  
  // 切换收藏状态
  toggleFavorite() {
    const breadName = this.data.currentBread;
    if (!breadName) return;
    
    const app = getApp();
    const breadId = app.getBreadIdByName(breadName);
    if (!breadId) return;
    
    const newStatus = app.toggleFavorite(breadId);
    
    // 更新收藏状态
    this.setData({ isFavorite: newStatus });
    
    // 显示提示
    wx.showToast({
      title: newStatus ? '已加入收藏' : '已取消收藏',
      icon: 'success',
      duration: 1500
    });
  },
  
  // 检查API密钥是否有效
  checkApiKey() {
    if (!config.apiKey || config.apiKey === '') {
      this.setData({
        apiKeyValid: false
      });
      
      // 添加错误消息
      const errorMsg = { 
        id: Date.now(), 
        type: 'bot', 
        content: '抱歉，AI服务暂时不可用。请联系开发者配置API密钥。',
        timeString: this.formatTime(new Date())
      };
      
      this.setData({
        messages: [errorMsg]
      });
    }
  },
  
  onInput(e) {
    this.setData({ inputMsg: e.detail.value });
  },
  
  // 格式化时间
  formatTime(date) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return [hour, minute].map(this.formatNumber).join(':');
  },
  
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },
  
  // 发送消息
  sendMsg() {
    if (!this.data.inputMsg.trim()) return;
    
    // 如果API密钥无效，显示错误消息
    if (!this.data.apiKeyValid) {
      this.handleAIError('AI服务暂时不可用，请联系开发者配置API密钥');
      return;
    }
    
    // 添加用户消息
    const userMsg = { 
      id: Date.now(), 
      type: 'user', 
      content: this.data.inputMsg,
      timeString: this.formatTime(new Date())
    };
    
    this.setData({ 
      messages: [...this.data.messages, userMsg], 
      inputMsg: '',
      isLoading: true,
      scrollToBottom: true,
      inputFocus: true // 保持输入框焦点
    });
    
    // 滚动到底部
    this.scrollToBottom();
    
    // 调用AI接口获取回复
    this.getAIResponse(userMsg.content);
  },
  
  // 调用Moonshot AI接口
  getAIResponse(userMessage) {
    const that = this;
    
    // 构建提示词，引导AI回答面包相关问题
    const systemPrompt = "你是一位专业的面包师，名叫'面包小助手'。你擅长回答关于面包制作、烘焙技巧、食材选择等问题。请用友好、专业的语气回答用户的面包相关问题。如果用户询问非面包相关的问题，礼貌地引导他们回到面包话题。回答应该简洁明了，易于理解。";
    
    // 构建对话历史
    const messages = [
      { role: "system", content: systemPrompt }
    ];
    
    // 添加历史对话记录（最多10条）
    const historyMessages = this.data.messages.slice(-10);
    historyMessages.forEach(msg => {
      if (msg.type === 'user') {
        messages.push({ role: "user", content: msg.content });
      } else if (msg.type === 'bot') {
        messages.push({ role: "assistant", content: msg.content });
      }
    });
    
    // 尝试使用主模型
    this.sendMoonshotRequest(config.model, messages);
  },
  
  // 发送Moonshot API请求
  sendMoonshotRequest(modelName, messages, fallbackIndex = 0) {
    const that = this;
    
    console.log(`使用Moonshot模型: ${modelName}`);
    
    // 更新当前模型状态
    this.setData({
      currentModel: modelName,
      modelStatus: 'loading'
    });
    
    // 发起请求
    wx.request({
      url: config.apiUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      data: {
        model: modelName,
        messages: messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens
      },
      success(res) {
        console.log('Moonshot AI响应:', res);
        
        if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices.length > 0) {
          const aiResponse = res.data.choices[0].message.content;
          
          // 添加AI回复消息
          const botMsg = { 
            id: Date.now(), 
            type: 'bot', 
            content: aiResponse,
            timeString: that.formatTime(new Date())
          };
          
          that.setData({
            messages: [...that.data.messages, botMsg],
            isLoading: false,
            scrollToBottom: true,
            modelStatus: 'ready'
          });
          
          // 滚动到底部
          that.scrollToBottom();
        } else {
          // 处理错误响应
          let errorMessage = '连接失败，请稍后重试';
          
          // 提取API返回的错误信息（如果有）
          if (res.data && res.data.error && res.data.error.message) {
            errorMessage = res.data.error.message;
            console.error('Moonshot API错误:', errorMessage);
          }
          
          // 如果当前模型请求失败，尝试备用模型
          if (res.statusCode === 400 || res.statusCode === 404) {
            that.setData({ modelStatus: 'error' });
            that.tryFallbackModel(messages, fallbackIndex);
          } else {
            that.setData({ modelStatus: 'error' });
            that.handleAIError(errorMessage);
          }
        }
      },
      fail(err) {
        console.error('Moonshot AI请求失败:', err);
        
        // 请求失败，尝试备用模型
        that.setData({ modelStatus: 'error' });
        that.tryFallbackModel(messages, fallbackIndex);
      },
      // 添加超时设置
      timeout: 15000 // 15秒超时
    });
  },
  
  // 尝试使用备用模型
  tryFallbackModel(messages, currentIndex) {
    // 检查是否还有备用模型可用
    if (config.fallbackModels && currentIndex < config.fallbackModels.length) {
      const fallbackModel = config.fallbackModels[currentIndex];
      this.sendMoonshotRequest(fallbackModel, messages, currentIndex + 1);
    } else {
      // 所有模型都尝试失败
      this.handleAIError('连接失败，请稍后重试');
    }
  },
  
  // 处理AI请求错误
  handleAIError(errorMsg) {
    const botMsg = { 
      id: Date.now(), 
      type: 'bot', 
      content: `抱歉，${errorMsg}。我是一个专业的面包师，可以回答你关于面包制作的问题。`,
      timeString: this.formatTime(new Date())
    };
    
    this.setData({
      messages: [...this.data.messages, botMsg],
      isLoading: false,
      scrollToBottom: true
    });
    
    this.scrollToBottom();
  },
  
  // 滚动到底部
  scrollToBottom() {
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('#scroll-to-bottom')
        .boundingClientRect(rect => {
          if (rect && this.data.scrollToBottom) {
            wx.pageScrollTo({
              scrollTop: rect.bottom,
              duration: 300
            });
          }
        })
        .exec();
    }, 100);
  },
  
  // 重置对话
  resetConversation() {
    wx.showModal({
      title: '重置对话',
      content: '确定要清空当前对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 重置为初始欢迎消息
          this.setData({
            messages: [
              { 
                id: Date.now(), 
                type: 'bot', 
                content: '你好！我是面包小助手，可以回答你关于面包制作的任何问题。你想了解哪种面包的制作方法？',
                timeString: this.formatTime(new Date())
              }
            ],
            currentBread: '',
            tutorialBread: null,
            inputMsg: '',
            isFavorite: false
          });
        }
      }
    });
  },
  
  // 快速输入预设问题
  quickInput(e) {
    this.setData({ inputMsg: e.currentTarget.dataset.text });
  },
  
  // 选择热门教程
  selectTutorial(e) {
    const bread = e.currentTarget.dataset.bread;
    this.setData({ 
      currentBread: bread,
      tutorialBread: bread
    });
    
    // 检查收藏状态
    this.checkFavoriteStatus(bread);
    
    // 添加教程欢迎消息
    const welcomeMsg = { 
      id: Date.now(), 
      type: 'bot', 
      content: `欢迎学习${bread}制作教程！我会为你提供详细的制作步骤、所需材料和烘焙技巧。你有什么想了解的吗？`,
      timeString: this.formatTime(new Date())
    };
    
    this.setData({
      messages: [welcomeMsg],
      scrollToBottom: true
    });
    
    this.scrollToBottom();
  }
}); 