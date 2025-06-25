# 微信小程序部署指南

## 1. 开发工具准备
- 下载并安装微信开发者工具
- 注册微信小程序账号并获取 AppID

## 2. 项目导入
1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目目录
4. 填入 AppID
5. 项目名称：面包脑袋

## 3. 图片资源
请确保以下图片文件放置在 images/ 目录下：
- splash-screen.png (启动页背景)
- lottery-background.png (抽签页背景)
- result-background.png (结果页背景)
- bread-character.png (面包精灵)
- bread-assistant.png (面包小助手头像)
- card-back.png (卡牌背面)
- chocolate-croissant.png (巧克力可颂)
- strawberry-pretzel.png (草莓碱水包)
- pistachio-cream-roll.png (开心果奶油卷)
- 以及其他面包图片...

## 4. 功能特性
✅ 启动页自动跳转
✅ 面包抽签功能
✅ 面包合集浏览（已移除欧式面包和中式面包分类）
✅ 智能教程聊天
✅ 收藏功能
✅ 响应式设计
✅ 微信小程序规范

## 5. 页面结构
- 启动页 (splash)
- 抽签页 (lottery) - 默认首页
- 结果页 (result)
- 合集页 (collection)
- 教程页 (tutorial)
- 个人页 (profile)

## 6. 注意事项
- 所有代码完全符合微信小程序规范
- 使用 .wxml、.wxss、.js、.json 文件格式
- 已修复所有变量声明问题
- 移除了欧式面包和中式面包分类
- 保持了原有的设计风格和交互体验
