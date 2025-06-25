面包脑袋微信小程序完整文件结构：

bread-head-miniprogram/
├── app.js                    # 小程序入口文件
├── app.json                  # 小程序全局配置
├── app.wxss                  # 小程序全局样式
├── sitemap.json              # 站点地图配置
├── images/                   # 图片资源目录
│   ├── splash-screen.png
│   ├── lottery-background.png
│   ├── result-background.png
│   ├── bread-character.png
│   ├── bread-assistant.png
│   ├── card-back.png
│   ├── chocolate-croissant.png
│   ├── strawberry-pretzel.png
│   ├── pistachio-cream-roll.png
│   ├── new-chocolate-croissant.jpg
│   ├── new-strawberry-pretzel.jpg
│   ├── new-pistachio-roll.jpg
│   ├── garlic-herb-baguette.png
│   ├── sea-salt-croissant.png
│   ├── whole-wheat-bagel.png
│   ├── cranberry-cream-bagel.png
│   ├── caterpillar-bread.png
│   ├── japanese-red-bean-bun.png
│   ├── tab-lottery.png
│   ├── tab-lottery-active.png
│   ├── tab-tutorial.png
│   ├── tab-tutorial-active.png
│   ├── tab-collection.png
│   ├── tab-collection-active.png
│   ├── tab-profile.png
│   └── tab-profile-active.png
└── pages/                    # 页面目录
    ├── splash/               # 启动页
    │   ├── splash.wxml
    │   ├── splash.wxss
    │   ├── splash.js
    │   └── splash.json
    ├── lottery/              # 抽签页
    │   ├── lottery.wxml
    │   ├── lottery.wxss
    │   ├── lottery.js
    │   └── lottery.json
    ├── result/               # 结果页
    │   ├── result.wxml
    │   ├── result.wxss
    │   ├── result.js
    │   └── result.json
    ├── collection/           # 合集页
    │   ├── collection.wxml
    │   ├── collection.wxss
    │   ├── collection.js
    │   └── collection.json
    ├── tutorial/             # 教程页
    │   ├── tutorial.wxml
    │   ├── tutorial.wxss
    │   ├── tutorial.js
    │   └── tutorial.json
    └── profile/              # 个人页
        ├── profile.wxml
        ├── profile.wxss
        ├── profile.js
        └── profile.json
\`\`\`

```wxml file="pages/tutorial/tutorial.wxml"
<view class="container">
  <view class="content px-6 py-4">
    &lt;!-- 头部 -->
    <view class="header mb-6">
      <view class="assistant-info">
        <view class="avatar">
          <image src="/images/bread-assistant.png" class="avatar-image"></image>
        </view>
        <view class="info">
          <text class="name font-bold text-primary">面包小助手</text>
          <text class="desc text-xs text-secondary">
            {{tutorialBread ? tutorialBread.name + '制作教程' : '面包制作专家'}}
          </text>
        </view>
      </view>
    </view>

    &lt;!-- 聊天消息区域 -->
    <view class="chat-area">
      <scroll-view scroll-y 
                   scroll-into-view="{{scrollIntoView}}"
                   class="messages-container">
        
        &lt;!-- 默认欢迎界面 -->
        <view wx:if="{{chatMessages.length === 0 && !tutorialBread}}" class="welcome-screen text-center">
          <view class="welcome-avatar mb-4">
            <image src="/images/bread-assistant.png" class="welcome-image"></image>
          </view>
          <text class="welcome-title text-lg font-bold text-primary mb-2">欢迎来到面包教程！</text>
          <text class="welcome-subtitle text-sm text-secondary mb-4">我是你的面包制作小助手</text>
          <text class="welcome-desc text-xs text-muted mb-6">搜索你想学习的面包类型，或选择热门教程开始学习</text>

          &lt;!-- 热门教程推荐 -->
          <view class="tutorial-recommendations">
            <text class="recommendations-title text-sm font-bold text-primary mb-3">🔥 当前热门教程</text>
            <view class="recommendations-list">
              <button class="recommendation-btn chocolate-btn"
                      bindtap="selectTutorial"
                      data-bread="{{chocolateBread}}">
                <text class="btn-emoji">🥐</text>
                <text class="btn-text">巧克力可颂制作教程</text>
              </button>
              <button class="recommendation-btn strawberry-btn"
                      bindtap="selectTutorial"
                      data-bread="{{strawberryBread}}">
                <text class="btn-emoji">🥖</text>
                <text class="btn-text">草莓碱水包制作教程</text>
              </button>
              <button class="recommendation-btn pistachio-btn"
                      bindtap="selectTutorial"
                      data-bread="{{pistachioBread}}">
                <text class="btn-emoji">🍞</text>
                <text class="btn-text">开心果奶油卷制作教程</text>
              </button>
            </view>
          </view>
        </view>

        &lt;!-- 教程开始界面 -->
        <view wx:if="{{chatMessages.length === 0 && tutorialBread}}" class="tutorial-start text-center">
          <text class="start-icon">🍞</text>
          <text class="start-title text-lg font-bold text-primary mb-2">欢迎来到面包教程！</text>
          <text class="start-subtitle text-sm text-secondary mb-4">我是你的面包制作小助手</text>
          <text class="start-desc text-xs text-muted">开始学习{{tutorialBread.name}}的制作方法吧！</text>
        </view>

        &lt;!-- 聊天消息 -->
        <view wx:for="{{chatMessages}}" wx:key="id" 
              class="message-item {{item.type === 'user' ? 'user-message' : 'bot-message'}}"
              id="msg-{{index}}">
          
          <view class="message-content">
            &lt;!-- 机器人消息头像 -->
            <view wx:if="{{item.type === 'bot'}}" class="bot-info mb-1">
              <view class="bot-avatar">
                <image src="/images/bread-assistant.png" class="bot-avatar-image"></image>
              </view>
              <text class="bot-name text-xs text-secondary">面包小助手</text>
            </view>

            &lt;!-- 消息气泡 -->
            <view class="message-bubble {{item.type === 'user' ? 'user-bubble' : 'bot-bubble'}}">
              <text class="message-text {{item.type === 'user' ? 'user-text' : 'bot-text'}}">{{item.content}}</text>
            </view>

            &lt;!-- 消息时间 -->
            <text class="message-time text-xs text-muted {{item.type === 'user' ? 'user-time' : 'bot-time'}}">
              {{item.timeString}}
            </text>
          </view>
        </view>

        &lt;!-- 正在输入提示 -->
        <view wx:if="{{isTyping}}" class="typing-indicator bot-message">
          <view class="message-content">
            <view class="bot-info mb-1">
              <view class="bot-avatar">
                <image src="/images/bread-assistant.png" class="bot-avatar-image"></image>
              </view>
              <text class="bot-name text-xs text-secondary">面包小助手</text>
            </view>
            
            <view class="message-bubble bot-bubble">
              <view class="typing-dots">
                <view class="dot dot1"></view>
                <view class="dot dot2"></view>
                <view class="dot dot3"></view>
              </view>
            </view>
          </view>
        </view>

        <view id="chat-bottom"></view>
      </scroll-view>
    </view>

    &lt;!-- 输入区域 -->
    <view class="input-area">
      <view class="input-container mb-3">
        <input class="message-input" 
               placeholder="{{tutorialBread ? '询问' + tutorialBread.name + '制作问题...' : '搜索面包类型或询问制作问题...'}}"
               value="{{inputMessage}}"
               bindinput="onInputChange"
               bindconfirm="sendMessage"/>
        <button class="send-btn {{inputMessage.length > 0 ? 'active' : ''}}"
                bindtap="sendMessage"
                disabled="{{isTyping || inputMessage.length === 0}}">
          <text class="send-icon">➤</text>
        </button>
      </view>

      &lt;!-- 快捷操作按钮 -->
      <view class="quick-actions">
        <view wx:if="{{tutorialBread}}" class="action-buttons">
          <button class="action-btn" bindtap="quickInput" data-text="开始教程">开始教程</button>
          <button class="action-btn" bindtap="quickInput" data-text="需要什么材料">需要什么材料</button>
          <button class="action-btn" bindtap="quickInput" data-text="发酵技巧">发酵技巧</button>
          <button class="action-btn" bindtap="quickInput" data-text="烘烤温度">烘烤温度</button>
        </view>
        
        <view wx:else class="action-buttons">
          <button class="action-btn" bindtap="quickInput" data-text="巧克力面包怎么做">巧克力面包怎么做</button>
          <button class="action-btn" bindtap="quickInput" data-text="法式面包制作">法式面包制作</button>
          <button class="action-btn" bindtap="quickInput" data-text="抹茶面包教程">抹茶面包教程</button>
          <button class="action-btn" bindtap="quickInput" data-text="新手入门教程">新手入门教程</button>
        </view>
      </view>
    </view>
  </view>
</view>
