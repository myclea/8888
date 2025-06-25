// Moonshot AI API配置
const config = {
  apiKey: 'sk-caeoV8NHxefu95JvaHA8jt7f7xEfb3o9Xc40ECHL8l2k8F7g',
  apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
  model: 'moonshot-v1-8k', // Moonshot的默认模型
  fallbackModels: [
    'moonshot-v1-32k',
    'moonshot-v1-128k'
  ], // 备用模型列表
  temperature: 0.7,
  maxTokens: 800
};

export default config; 