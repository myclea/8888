"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Heart, Gift, Star, BookOpen, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ChatMessage {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

export default function BreadHeadApp() {
  const [currentScreen, setCurrentScreen] = useState("splash")
  const [selectedBread, setSelectedBread] = useState<any>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [flashingCards, setFlashingCards] = useState<number[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [tutorialBread, setTutorialBread] = useState<any>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const breadTypes = [
    {
      id: 1,
      name: "巧克力面包",
      emoji: "🍞",
      color: "#fff6cc",
      description: "香甜的巧克力面包，温暖你的心",
    },
    {
      id: 2,
      name: "法式长棍",
      emoji: "🥖",
      color: "#fbc9d6",
      description: "经典法式面包，外酥内软",
    },
    {
      id: 3,
      name: "抹茶面包",
      emoji: "🍞",
      color: "#d8eec9",
      description: "清香抹茶味，健康美味",
    },
  ]

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const getBreadTutorialContent = (breadId: number) => {
    switch (breadId) {
      case 1: // 巧克力可颂
        return {
          welcome:
            "你好！我是面包小助手🍞 看到你想学习制作巧克力可颂，这可是我的拿手好戏呢！让我来教你如何制作这款香甜酥脆的美味吧～",
          steps: [
            "首先准备材料：高筋面粉250g、黄油200g、牛奶120ml、酵母3g、糖30g、盐5g、黑巧克力100g",
            "制作面团：将面粉、糖、盐混合，加入温牛奶和酵母，揉成光滑面团",
            "黄油处理：将黄油软化后擀成薄片，放入冰箱冷藏30分钟",
            "包入黄油：将面团擀开，包入黄油片，进行三次三折叠制",
            "最后发酵：整形后放入巧克力，最后发酵45分钟",
            "烘烤完成：烤箱200°C烘烤15-18分钟至金黄色即可",
          ],
        }
      case 2: // 草莓碱水包
        return {
          welcome:
            "嗨！我是你的面包导师🥖 草莓碱水包是德式面包的经典，粉嫩可爱又美味！让我手把手教你制作这款少女心满满的面包吧～",
          steps: [
            "准备材料：高筋面粉300g、草莓果酱80g、牛奶150ml、酵母4g、糖40g、盐6g、食用碱20g",
            "制作面团：混合干性材料，加入牛奶揉成柔软面团，发酵1小时",
            "调制碱水：将食用碱溶于温水中，制成碱水溶液",
            "整形处理：将面团分割整形，表面刷上草莓果酱",
            "碱水浸泡：将整形好的面包在碱水中快速浸泡5秒",
            "烘烤上色：烤箱220°C烘烤12-15分钟，呈现美丽的粉色",
          ],
        }
      case 3: // 开心果奶油卷
        return {
          welcome:
            "欢迎来到面包课堂！🌿 开心果奶油卷是我最喜欢的健康面包之一，清香的开心果配上丝滑奶油，每一口都是享受！来学习制作吧～",
          steps: [
            "材料准备：高筋面粉280g、开心果粉50g、淡奶油100ml、牛奶100ml、酵母3g、糖35g、盐4g",
            "面团制作：将开心果粉与面粉混合，加入其他材料揉成绿色面团",
            "第一次发酵：面团发酵至两倍大，约1.5小时",
            "奶油调制：淡奶油打发至6分发，加入少许开心果碎",
            "卷制成型：将面团擀开，涂抹奶油馅，卷成圆筒状",
            "最终烘烤：二次发酵后，烤箱180°C烘烤20-25分钟",
          ],
        }
      default:
        return {
          welcome: "你好！我是面包小助手，很高兴为你提供面包制作教程！",
          steps: ["请选择你想学习的面包类型，我会为你提供详细的制作指导。"],
        }
    }
  }

  const initializeTutorialChat = (bread: any) => {
    const tutorialContent = getBreadTutorialContent(bread.id)
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "bot",
      content: tutorialContent.welcome,
      timestamp: new Date(),
    }
    setChatMessages([welcomeMessage])
    setTutorialBread(bread)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(
      () => {
        let botResponse = ""

        // 如果没有选择特定面包，检查是否在搜索面包类型
        if (!tutorialBread) {
          if (inputMessage.includes("巧克力") || inputMessage.includes("可颂")) {
            const bread = { id: 1, name: "巧克力可颂", emoji: "🥐", color: "#fff6cc" }
            initializeTutorialChat(bread)
            return
          } else if (inputMessage.includes("草莓") || inputMessage.includes("碱水包")) {
            const bread = { id: 2, name: "草莓碱水包", emoji: "🥖", color: "#fbc9d6" }
            initializeTutorialChat(bread)
            return
          } else if (inputMessage.includes("开心果") || inputMessage.includes("奶油卷")) {
            const bread = { id: 3, name: "开心果奶油卷", emoji: "🍞", color: "#d8eec9" }
            initializeTutorialChat(bread)
            return
          } else if (inputMessage.includes("新手") || inputMessage.includes("入门")) {
            botResponse =
              "欢迎新手朋友！我推荐你从以下几种简单的面包开始：\n\n🥐 巧克力可颂 - 层次丰富，制作有趣\n🥖 草莓碱水包 - 颜值很高，步骤清晰\n🍞 开心果奶油卷 - 健康美味，适合练手\n\n你想学习哪一种呢？"
          } else {
            botResponse =
              "我可以教你制作多种美味面包！目前有以下热门教程：\n\n🥐 巧克力可颂 - 香甜酥脆\n🥖 草莓碱水包 - 粉嫩可爱\n🍞 开心果奶油卷 - 清香健康\n\n直接说出你想学的面包名称，我就能为你开始专属教程！"
          }
        } else {
          // 保持现有的tutorialBread存在时的逻辑不变
          const tutorialContent = getBreadTutorialContent(tutorialBread?.id || 0)

          if (inputMessage.includes("开始") || inputMessage.includes("教程") || inputMessage.includes("步骤")) {
            botResponse = `好的！让我为你详细介绍${tutorialBread?.name}的制作步骤：\n\n${tutorialContent.steps.map((step, index) => `${index + 1}. ${step}`).join("\n\n")}\n\n有什么不明白的地方可以随时问我哦！`
          } else if (inputMessage.includes("材料") || inputMessage.includes("准备")) {
            botResponse = tutorialContent.steps[0]
          } else if (inputMessage.includes("面团") || inputMessage.includes("揉面")) {
            botResponse = tutorialContent.steps[1] + "\n\n揉面小贴士：要揉到面团表面光滑有弹性，大约需要15-20分钟哦！"
          } else if (inputMessage.includes("发酵")) {
            botResponse =
              "发酵是面包制作的关键步骤！温度控制在28-30°C最佳，湿度保持在75%左右。你可以在烤箱里放一碗热水来创造合适的发酵环境。"
          } else if (inputMessage.includes("烘烤") || inputMessage.includes("温度")) {
            botResponse =
              "烘烤温度很重要！预热烤箱很关键，烘烤过程中不要频繁开门。如果表面上色过快，可以盖上锡纸继续烘烤。"
          } else if (inputMessage.includes("谢谢") || inputMessage.includes("感谢")) {
            botResponse = "不客气！很高兴能帮助你学习面包制作。记住，多练习是成功的关键，祝你制作出美味的面包！🍞✨"
          } else {
            botResponse = `关于${tutorialBread?.name}的制作，我建议你可以问我：\n• "开始教程" - 获取完整制作步骤\n• "材料准备" - 了解所需材料\n• "发酵技巧" - 学习发酵要点\n• "烘烤温度" - 掌握烘烤技巧\n\n还有什么想了解的吗？`
          }
        }

        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        }

        setChatMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const StatusBar = () => (
    <div className="flex justify-between items-center px-4 py-2 text-sm font-medium">
      <span>9:41</span>
      <div className="w-20 h-6 bg-black rounded-full"></div>
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
        </div>
        <div className="w-6 h-3 border border-black rounded-sm">
          <div className="w-4 h-1 bg-black rounded-sm m-0.5"></div>
        </div>
      </div>
    </div>
  )

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        <button
          onClick={() => setCurrentScreen("lottery")}
          className={`flex flex-col items-center gap-1 p-2 ${currentScreen === "lottery" ? "text-[#007aff]" : "text-gray-500"}`}
        >
          <Gift size={20} />
          <span className="text-xs">抽签</span>
        </button>
        <button
          onClick={() => setCurrentScreen("tutorial")}
          className={`flex flex-col items-center gap-1 p-2 ${currentScreen === "tutorial" ? "text-[#007aff]" : "text-gray-500"}`}
        >
          <BookOpen size={20} />
          <span className="text-xs">教程</span>
        </button>
        <button
          onClick={() => setCurrentScreen("collection")}
          className={`flex flex-col items-center gap-1 p-2 ${currentScreen === "collection" ? "text-[#007aff]" : "text-gray-500"}`}
        >
          <Star size={20} />
          <span className="text-xs">合集</span>
        </button>
        <button
          onClick={() => setCurrentScreen("profile")}
          className={`flex flex-col items-center gap-1 p-2 ${currentScreen === "profile" ? "text-[#007aff]" : "text-gray-500"}`}
        >
          <Heart size={20} />
          <span className="text-xs">收藏</span>
        </button>
      </div>
    </div>
  )

  const SplashScreen = () => (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/splash-screen.png')",
        }}
      />

      {/* Status Bar */}
      <div className="relative z-10">
        <StatusBar />
      </div>

      {/* Skip Button */}
      <div className="absolute bottom-20 right-6 z-20">
        <Button
          onClick={() => setCurrentScreen("lottery")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-full shadow-lg text-sm"
        >
          跳过
        </Button>
      </div>
    </div>
  )

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8d4] to-[#f5edc4] pb-20">
      <StatusBar />
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#3c3c43] mb-2">面包脑袋</h1>
          <h2 className="text-lg font-semibold text-[#787880] mb-2">Bread Head</h2>
          <p className="text-sm text-[#787880] mb-1">面包脑袋上线，选、学、吃全搞定！</p>
          <p className="text-xs text-[#999999]">Bread lover alert! Choose, learn, and savor with ease!</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="text-6xl mb-4">🍞👨‍🍳👩‍🍳🥖</div>
            <div className="flex justify-center gap-4">
              <span className="bg-[#fdc03c] text-white px-3 py-1 rounded-full text-sm font-bold">Yami!</span>
              <span className="bg-[#bf6b3c] text-white px-3 py-1 rounded-full text-sm font-bold">Yum!</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-[#787880] mb-1">你的面包小助手，有趣又有料</p>
          <p className="text-xs text-[#999999]">Your bread buddy: fun and flavorful!</p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setCurrentScreen("lottery")}
            className="bg-[#007aff] hover:bg-[#007aff]/90 text-white px-8 py-2 rounded-full"
          >
            跳过
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  )

  const handleStartDraw = () => {
    setIsDrawing(true)

    // 随机闪动效果
    const flashSequence = () => {
      const cardCount = 7
      const flashDuration = 2000 // 2秒闪动
      const flashInterval = 150 // 每150ms闪动一次

      let currentTime = 0
      const interval = setInterval(() => {
        // 随机选择1-3张卡牌闪动
        const numFlashing = Math.floor(Math.random() * 3) + 1
        const randomCards = []
        for (let i = 0; i < numFlashing; i++) {
          randomCards.push(Math.floor(Math.random() * cardCount) + 1)
        }
        setFlashingCards([...new Set(randomCards)]) // 去重

        currentTime += flashInterval
        if (currentTime >= flashDuration) {
          clearInterval(interval)
          setFlashingCards([])
          setIsDrawing(false)
          // 延迟一下再跳转到结果页面
          setTimeout(() => {
            setCurrentScreen("result")
          }, 300)
        }
      }, flashInterval)
    }

    flashSequence()
  }

  const LotteryScreen = () => (
    <div
      className="min-h-screen relative pb-20"
      style={{
        backgroundImage: "url('/images/lottery-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <StatusBar />
      <div className="px-6 py-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#3c3c43] mb-4">面包抽签</h1>
          <p className="text-sm text-[#787880] mb-1">轻松一抽</p>
          <p className="text-xs text-[#999999]">发现你的下一款心头好！</p>
        </div>

        {/* Card Fan Layout */}
        <div className="relative flex justify-center items-center mb-6 h-64 perspective-1000">
          {/* Card 1 - Far Left */}
          <div
            className={`absolute w-16 h-24 rounded-lg shadow-2xl border-2 border-[#bf6b3c] transform transition-all duration-150
              -rotate-30 -translate-x-28 translate-y-8 ${flashingCards.includes(1) ? "scale-110 brightness-150 shadow-yellow-400/50" : ""}`}
            style={{
              zIndex: 1,
              backgroundImage: "url('/images/card-back.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transformStyle: "preserve-3d",
            }}
          ></div>

          {/* Card 2 - Left */}
          <div
            className={`absolute w-16 h-24 rounded-lg shadow-2xl border-2 border-[#bf6b3c] transform transition-all duration-150
              -rotate-20 -translate-x-20 translate-y-6 ${flashingCards.includes(2) ? "scale-110 brightness-150 shadow-yellow-400/50" : ""}`}
            style={{
              zIndex: 2,
              backgroundImage: "url('/images/card-back.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transformStyle: "preserve-3d",
            }}
          ></div>

          {/* Card 3 - Center Left */}
          <div
            className={`absolute w-16 h-24 rounded-lg shadow-2xl border-2 border-[#bf6b3c] transform transition-all duration-150
              -rotate-10 -translate-x-12 translate-y-4 ${flashingCards.includes(3) ? "scale-110 brightness-150 shadow-yellow-400/50" : ""}`}
            style={{
              zIndex: 3,
              backgroundImage: "url('/images/card-back.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transformStyle: "preserve-3d",
            }}
          ></div>

          {/* Card 4 - Center */}
          <div
            className={`absolute w-16 h-24 rounded-lg shadow-2xl border-2 border-[#bf6b3c] transform transition-all duration-150
              translate-y-2 ${flashingCards.includes(4) ? "scale-110 brightness-150 shadow-yellow-400/50" : ""}`}
            style={{
              zIndex: 4,
              backgroundImage: "url('/images/card-back.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transformStyle: "preserve-3d",
            }}
          ></div>

          {/* Card 5 - Center Right */}
          <div
            className={`absolute w-16 h-24 rounded-lg shadow-2xl border-2 border-[#bf6b3c] transform transition-all duration-150
              rotate-10 translate-x-12 translate-y-4 ${flashingCards.includes(5) ? "scale-110 brightness-150 shadow-yellow-400/50" : ""}`}
            style={{
              zIndex: 3,
              backgroundImage: "url('/images/card-back.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transformStyle: "preserve-3d",
            }}
          ></div>

          {/* Card 6 - Right */}
          <div
            className={`absolute w-16 h-24 rounded-lg shadow-2xl border-2 border-[#bf6b3c] transform transition-all duration-150
              rotate-20 translate-x-20 translate-y-6 ${flashingCards.includes(6) ? "scale-110 brightness-150 shadow-yellow-400/50" : ""}`}
            style={{
              zIndex: 2,
              backgroundImage: "url('/images/card-back.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transformStyle: "preserve-3d",
            }}
          ></div>

          {/* Card 7 - Far Right */}
          <div
            className={`absolute w-16 h-24 rounded-lg shadow-2xl border-2 border-[#bf6b3c] transform transition-all duration-150
              rotate-30 translate-x-28 translate-y-8 ${flashingCards.includes(7) ? "scale-110 brightness-150 shadow-yellow-400/50" : ""}`}
            style={{
              zIndex: 1,
              backgroundImage: "url('/images/card-back.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transformStyle: "preserve-3d",
            }}
          ></div>
        </div>

        {/* Speech Bubble */}
        <div className="flex justify-center mb-4">
          <div className="relative bg-white rounded-2xl px-4 py-2 shadow-lg">
            <p className="text-sm text-[#787880]">不知道选什么？来抽个签吧！</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </div>
        </div>

        {/* Bread Character */}
        <div className="flex justify-center mb-6">
          <img src="/images/bread-character.png" alt="面包精灵" className="w-20 h-20 object-contain" />
        </div>

        {/* Diamond Pattern Background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 opacity-30"
          style={{
            background: `repeating-linear-gradient(45deg, #fdc03c 0px, #fdc03c 10px, #fff6cc 10px, #fff6cc 20px)`,
          }}
        ></div>

        {/* Button */}
        <div className="flex justify-center relative z-10">
          <Button
            onClick={handleStartDraw}
            disabled={isDrawing}
            className={`bg-gradient-to-b from-[#fdc03c] to-[#f4b942] hover:from-[#f4b942] hover:to-[#fdc03c] text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg border-2 border-[#bf6b3c] ${
              isDrawing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDrawing ? "抽签中..." : "开始抽卡"}
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  )

  // 更新CollectionScreen组件，实现瀑布流布局和固定导航

  const CollectionScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState("热门推荐")
    const [searchQuery, setSearchQuery] = useState("")

    const breadCategories = ["热门推荐", "法式面包", "碱水面包", "日式面包", "欧式面包", "中式面包"]

    const breadCollection = {
      热门推荐: [
        {
          id: 1,
          name: "巧克力可颂",
          description: "层次丰富的法式经典，酥脆外皮包裹着浓郁巧克力",
          image: "/images/new-chocolate-croissant.jpg",
          tags: ["经典"],
          category: "法式面包",
        },
        {
          id: 2,
          name: "草莓碱水包",
          description: "德式传统工艺制作，粉嫩可爱的外表下藏着香甜草莓",
          image: "/images/new-strawberry-pretzel.jpg",
          tags: ["人气"],
          category: "碱水面包",
        },
        {
          id: 3,
          name: "开心果奶油卷",
          description: "清香开心果配丝滑奶油，每一口都是自然的馈赠",
          image: "/images/new-pistachio-roll.jpg",
          tags: ["新品"],
          category: "日式面包",
        },
      ],
      法式面包: [
        {
          id: 4,
          name: "蒜香法棍",
          description: "香蒜调味，外酥内软，经典法式风味",
          image: "/images/garlic-herb-baguette.png",
          tags: ["经典"],
          category: "法式面包",
        },
        {
          id: 5,
          name: "海盐可颂",
          description: "海盐提味，层次丰富，每一层都有惊喜",
          image: "/images/sea-salt-croissant.png",
          tags: ["精选"],
          category: "法式面包",
        },
        {
          id: 6,
          name: "橙香巧克力法棍",
          description: "橙皮香气配巧克力，酸甜与苦香的完美融合",
          image: "/images/orange-chocolate-baguette.jpg",
          tags: ["新品"],
          category: "法式面包",
        },
        {
          id: 7,
          name: "香肠玉米恰巴塔",
          description: "意式面包配香肠玉米，丰富口感层次",
          image: "/images/sausage-corn-ciabatta.jpg",
          tags: ["咸味"],
          category: "法式面包",
        },
        {
          id: 8,
          name: "牛肉芝士恰巴塔",
          description: "牛肉芝士双重享受，满足你的味蕾",
          image: "/images/beef-cheese-ciabatta.jpg",
          tags: ["丰富"],
          category: "法式面包",
        },
        {
          id: 9,
          name: "菌菇佛卡夏",
          description: "香草菌菇，口感丰富，健康美味的选择",
          image: "/images/mushroom-focaccia.jpg",
          tags: ["健康"],
          category: "法式面包",
        },
      ],
      碱水面包: [
        {
          id: 10,
          name: "全麦贝果",
          description: "健康全麦，营养丰富，粗粮的天然香味",
          image: "/images/whole-wheat-bagel.png",
          tags: ["健康"],
          category: "碱水面包",
        },
        {
          id: 11,
          name: "蔓越莓乳酪贝果",
          description: "酸甜蔓越莓配奶香乳酪，层次丰富的口感体验",
          image: "/images/cranberry-cream-bagel.png",
          tags: ["酸甜"],
          category: "碱水面包",
        },
        {
          id: 12,
          name: "巧克力贝果",
          description: "浓郁巧克力风味，甜蜜诱人的经典选择",
          image: "/images/chocolate-bagel.png",
          tags: ["甜品"],
          category: "碱水面包",
        },
        {
          id: 13,
          name: "抹茶红豆贝果",
          description: "日式抹茶配红豆，清香与甜蜜的和谐统一",
          image: "/images/matcha-red-bean-bagel.png",
          tags: ["日式"],
          category: "碱水面包",
        },
        {
          id: 14,
          name: "黑芝麻碱水",
          description: "香浓黑芝麻，营养健康，传统风味的现代演绎",
          image: "/images/black-sesame-bagel.png",
          tags: ["营养"],
          category: "碱水面包",
        },
        {
          id: 15,
          name: "芋泥碱水",
          description: "香甜芋泥，口感绵密，紫色的浪漫诱惑",
          image: "/images/taro-bagel.png",
          tags: ["香甜"],
          category: "碱水面包",
        },
      ],
      日式面包: [
        {
          id: 16,
          name: "奶油毛毛包",
          description: "松软毛毛包配奶油，云朵般的轻盈口感",
          image: "/images/caterpillar-bread.png",
          tags: ["松软"],
          category: "日式面包",
        },
        {
          id: 17,
          name: "日式红豆包",
          description: "传统红豆馅，香甜可口，经典日式风味",
          image: "/images/japanese-red-bean-bun.png",
          tags: ["传统"],
          category: "日式面包",
        },
        {
          id: 18,
          name: "椰蓉面包",
          description: "椰香浓郁，口感丰富，热带风情的甜蜜体验",
          image: "/images/coconut-bread.png",
          tags: ["椰香"],
          category: "日式面包",
        },
        {
          id: 19,
          name: "岩烧乳酪面包",
          description: "烘烤乳酪，香浓诱人，奶香四溢的美味",
          image: "/images/cheese-bread.png",
          tags: ["乳酪"],
          category: "日式面包",
        },
        {
          id: 20,
          name: "云朵吐司",
          description: "轻盈如云，入口即化，极致柔软的享受",
          image: "/images/cloud-toast.png",
          tags: ["轻盈"],
          category: "日式面包",
        },
        {
          id: 21,
          name: "抹茶红豆吐司",
          description: "抹茶清香配红豆甜蜜，日式经典的完美结合",
          image: "/images/matcha-red-bean-toast.png",
          tags: ["抹茶"],
          category: "日式面包",
        },
      ],
      欧式面包: [
        {
          id: 22,
          name: "蔓越莓软欧",
          description: "酸甜蔓越莓，软欧经典，果香与面香的完美融合",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["酸甜"],
          category: "欧式面包",
        },
        {
          id: 23,
          name: "咸蛋黄软欧",
          description: "咸香蛋黄，独特风味，创新与传统的碰撞",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["咸香"],
          category: "欧式面包",
        },
        {
          id: 24,
          name: "南瓜坚果软欧",
          description: "南瓜香甜配坚果脆香，秋日暖阳般的温馨",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["坚果"],
          category: "欧式面包",
        },
        {
          id: 25,
          name: "英式吐司",
          description: "经典英式，口感醇厚，传统工艺的精髓体现",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["经典"],
          category: "欧式面包",
        },
      ],
      中式面包: [
        {
          id: 26,
          name: "馒头",
          description: "传统白馒头，朴实无华，家的味道",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["传统"],
          category: "中式面包",
        },
        {
          id: 27,
          name: "香葱花卷",
          description: "香葱调味，层次分明，传统工艺的现代演绎",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["香葱"],
          category: "中式面包",
        },
        {
          id: 28,
          name: "红糖馒头",
          description: "红糖香甜，营养丰富，温暖的童年记忆",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["香甜"],
          category: "中式面包",
        },
        {
          id: 29,
          name: "红头卷",
          description: "传统红糖花卷，螺旋造型，视觉与味觉的双重享受",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["传统"],
          category: "中式面包",
        },
        {
          id: 30,
          name: "窝窝头",
          description: "粗粮制作，健康朴实，返璞归真的美味",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["粗粮"],
          category: "中式面包",
        },
        {
          id: 31,
          name: "肉包子",
          description: "鲜美肉馅，皮薄馅大，传统早餐的经典选择",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["鲜美"],
          category: "中式面包",
        },
        {
          id: 32,
          name: "肉夹馍",
          description: "西安特色，肉香四溢，古都风味的独特魅力",
          image: "/placeholder.svg?height=60&width=60",
          tags: ["特色"],
          category: "中式面包",
        },
      ],
    }

    const currentBreads = breadCollection[selectedCategory] || []

    const filteredBreads = currentBreads.filter(
      (bread) =>
        bread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bread.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const toggleFavorite = (breadId: number) => {
      setFavorites((prev) => (prev.includes(breadId) ? prev.filter((id) => id !== breadId) : [...prev, breadId]))
    }

    const handleTutorialClick = (bread: any) => {
      // 根据面包类型创建教程内容
      const tutorialBread = {
        id: bread.id,
        name: bread.name,
        emoji: "🍞",
        color: "#fff6cc",
        description: bread.description,
      }

      initializeTutorialChat(tutorialBread)
      setCurrentScreen("tutorial")
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fff8d4] to-[#f5edc4] pb-20 flex flex-col">
        <StatusBar />

        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#fff8d4] to-[#f5edc4] px-4 py-4 border-b border-white/20">
          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-[#3c3c43]">面包合集</h1>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 rounded-2xl backdrop-blur-sm"></div>
              <Input
                placeholder="搜索你喜欢的面包..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative w-full bg-transparent border-0 rounded-2xl pl-12 pr-12 py-3 text-sm placeholder:text-gray-500 focus:ring-2 focus:ring-[#fdc03c]/30 focus:bg-white/90 transition-all duration-300 shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="#fdc03c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="21 21L16.65 16.65"
                    stroke="#fdc03c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-gradient-to-br from-[#fdc03c] to-[#f4b942] rounded-full flex items-center justify-center shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L12 23" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path
                      d="M17 6L12 1L7 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Fixed Left Sidebar - Categories */}
          <div className="w-20 p-2 space-y-2 bg-gradient-to-b from-transparent to-white/10">
            {breadCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full p-2 rounded-xl text-xs text-center transition-colors duration-300 leading-tight whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-white text-[#007aff] font-medium shadow-lg border border-[#007aff]/20"
                    : "bg-white/60 text-[#787880] hover:bg-white/80 backdrop-blur-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Scrollable Right Content - Waterfall Layout */}
          <div className="flex-1 px-3 py-2">
            <div className="h-full overflow-y-auto scrollbar-hide">
              <div className="columns-1 gap-3 space-y-3">
                {filteredBreads.map((bread, index) => (
                  <Card
                    key={bread.id}
                    className="break-inside-avoid bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] mb-2"
                    onClick={() => {
                      setSelectedBread(bread)
                      setShowDetailModal(true)
                    }}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        {/* 左侧1:1图片 */}
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img
                            src={bread.image || "/placeholder.svg"}
                            alt={bread.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* 右侧内容区域 */}
                        <div className="flex-1 flex flex-col justify-between min-h-16">
                          {/* 标题和描述 */}
                          <div className="flex-1">
                            <h3 className="font-bold text-[#3c3c43] text-xs mb-1 line-clamp-1">{bread.name}</h3>
                            <p className="text-xs text-[#787880] line-clamp-2 leading-relaxed">{bread.description}</p>
                          </div>

                          {/* 底部按钮区域 */}
                          <div className="flex items-center justify-end gap-1 mt-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-[#fdc03c] to-[#f4b942] hover:from-[#f4b942] hover:to-[#fdc03c] text-white px-2 py-1 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300 h-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTutorialClick(bread)
                              }}
                            >
                              <BookOpen size={10} className="mr-1" />
                              教程
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`p-1 rounded-full h-6 w-6 transition-all duration-300 ${
                                favorites.includes(bread.id)
                                  ? "text-red-500 hover:text-red-600 bg-red-50"
                                  : "text-gray-400 hover:text-gray-500 bg-gray-50"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(bread.id)
                              }}
                            >
                              <Heart size={10} fill={favorites.includes(bread.id) ? "currentColor" : "none"} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredBreads.length === 0 && (
                  <div className="text-center py-12 col-span-full">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-lg font-medium text-[#787880] mb-2">没有找到相关面包</p>
                    <p className="text-sm text-[#999999]">试试其他关键词或选择不同分类</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <BottomNav />

        {/* Detail Modal */}
        {showDetailModal && selectedBread && (
          <DetailModal bread={selectedBread} onClose={() => setShowDetailModal(false)} />
        )}

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .hover\\:scale-102:hover {
            transform: scale(1.02);
          }
        `}</style>
      </div>
    )
  }

  const DetailScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8d4] to-[#f5edc4] pb-20">
      <StatusBar />
      <div className="px-6 py-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentScreen("collection")}
            className="text-[#007aff] p-1"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">返回</span>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[#3c3c43]">面包详情</h1>
        </div>

        {selectedBread && (
          <div className="space-y-6">
            <div
              className="relative p-8 rounded-2xl"
              style={{
                background: `repeating-conic-gradient(#fdc03c 0% 25%, #fff6cc 0% 50%) 50% / 20px 20px`,
              }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedBread.emoji}</div>
                <h2 className="text-xl font-bold text-[#3c3c43] mb-2">{selectedBread.name}</h2>
                <p className="text-sm text-[#787880]">{selectedBread.description}</p>
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-[#787880] opacity-70">-lucky bread-</div>
            </div>

            <Card className="bg-white/80">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#3c3c43] mb-4">制作教程</h3>
                <div className="space-y-3 text-sm text-[#787880]">
                  <p>1. 准备面粉、酵母、糖等基础材料</p>
                  <p>2. 将材料混合，揉成光滑面团</p>
                  <p>3. 发酵至两倍大小</p>
                  <p>4. 整形后二次发酵</p>
                  <p>5. 烘烤至金黄色即可</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button className="bg-[#fdc03c] hover:bg-[#fdc03c]/90 text-white px-6 py-2 rounded-full">收藏配方</Button>
              <Button variant="outline" className="border-[#fdc03c] text-[#fdc03c] px-6 py-2 rounded-full">
                分享好友
              </Button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )

  const DetailModal = ({ bread, onClose }: { bread: any; onClose: () => void }) => {
    // Determine card colors based on bread type
    const getCardColors = (breadId: number) => {
      switch (breadId) {
        case 1: // Chocolate Croissant - Yellow/Gold theme
          return {
            borderColor1: "#bf6b3c",
            borderColor2: "#f4e4a6",
            cardBg: "#fff8e7",
          }
        case 2: // Strawberry Pretzel - Pink theme
          return {
            borderColor1: "#d4567a",
            borderColor2: "#f8d7da",
            cardBg: "#fdf2f8",
          }
        case 3: // Pistachio Roll - Green theme
          return {
            borderColor1: "#6b8e23",
            borderColor2: "#e8f5e8",
            cardBg: "#f0f9f0",
          }
        case 10: // 全麦贝果 - Brown theme
          return {
            borderColor1: "#8b4513",
            borderColor2: "#deb887",
            cardBg: "#faf0e6",
          }
        case 11: // 蔓越莓乳酪贝果 - Red theme
          return {
            borderColor1: "#dc143c",
            borderColor2: "#ffb6c1",
            cardBg: "#fff0f5",
          }
        case 12: // 巧克力贝果 - Dark brown theme
          return {
            borderColor1: "#654321",
            borderColor2: "#d2b48c",
            cardBg: "#fdf5e6",
          }
        case 13: // 抹茶红豆贝果 - Green theme
          return {
            borderColor1: "#228b22",
            borderColor2: "#98fb98",
            cardBg: "#f0fff0",
          }
        case 14: // 黑芝麻碱水 - Black theme
          return {
            borderColor1: "#2f4f4f",
            borderColor2: "#d3d3d3",
            cardBg: "#f8f8ff",
          }
        case 15: // 芋泥碱水 - Purple theme
          return {
            borderColor1: "#9370db",
            borderColor2: "#dda0dd",
            cardBg: "#f8f0ff",
          }
        case 16: // 奶油毛毛包 - Cream theme
          return {
            borderColor1: "#ffd700",
            borderColor2: "#fff8dc",
            cardBg: "#fffef7",
          }
        case 17: // 日式红豆包 - Red bean theme
          return {
            borderColor1: "#8b4513",
            borderColor2: "#deb887",
            cardBg: "#faf0e6",
          }
        case 18: // 椰蓉面包 - Coconut theme
          return {
            borderColor1: "#daa520",
            borderColor2: "#f5deb3",
            cardBg: "#fffaf0",
          }
        case 19: // 岩烧乳酪面包 - Cheese theme
          return {
            borderColor1: "#ff8c00",
            borderColor2: "#ffe4b5",
            cardBg: "#fff8dc",
          }
        case 20: // 云朵吐司 - Cloud theme
          return {
            borderColor1: "#b0c4de",
            borderColor2: "#f0f8ff",
            cardBg: "#f8f8ff",
          }
        case 21: // 抹茶红豆吐司 - Matcha theme
          return {
            borderColor1: "#228b22",
            borderColor2: "#98fb98",
            cardBg: "#f0fff0",
          }
        default:
          return {
            borderColor1: "#bf6b3c",
            borderColor2: "#f4e4a6",
            cardBg: "#fff8e7",
          }
      }
    }

    const colors = getCardColors(bread.id)

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="relative w-full max-w-xs mx-auto" onClick={(e) => e.stopPropagation()}>
          <div
            className="p-4 rounded-3xl shadow-2xl"
            style={{
              background: `repeating-conic-gradient(${colors.borderColor1} 0% 25%, ${colors.borderColor2} 0% 50%) 50% / 16px 16px`,
            }}
          >
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                backgroundColor: colors.cardBg,
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div className="mb-6">
                {bread.id === 1 && (
                  <img
                    src="/images/chocolate-croissant.png"
                    alt="巧克力可颂"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 2 && (
                  <img
                    src="/images/strawberry-pretzel.png"
                    alt="草莓碱水包"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 3 && (
                  <img
                    src="/images/pistachio-cream-roll.png"
                    alt="开心果奶油卷"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 10 && (
                  <img
                    src="/images/whole-wheat-bagel.png"
                    alt="全麦贝果"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 11 && (
                  <img
                    src="/images/cranberry-cream-bagel.png"
                    alt="蔓越莓乳酪贝果"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 12 && (
                  <img
                    src="/images/chocolate-bagel.png"
                    alt="巧克力贝果"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 13 && (
                  <img
                    src="/images/matcha-red-bean-bagel.png"
                    alt="抹茶红豆贝果"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 14 && (
                  <img
                    src="/images/black-sesame-bagel.png"
                    alt="黑芝麻碱水"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 15 && (
                  <img src="/images/taro-bagel.png" alt="芋泥碱水" className="w-20 h-20 mx-auto object-contain" />
                )}
                {bread.id === 16 && (
                  <img
                    src="/images/caterpillar-bread.png"
                    alt="奶油毛毛包"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 17 && (
                  <img
                    src="/images/japanese-red-bean-bun.png"
                    alt="日式红豆包"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
                {bread.id === 18 && (
                  <img src="/images/coconut-bread.png" alt="椰蓉面包" className="w-20 h-20 mx-auto object-contain" />
                )}
                {bread.id === 19 && (
                  <img src="/images/cheese-bread.png" alt="岩烧乳酪面包" className="w-20 h-20 mx-auto object-contain" />
                )}
                {bread.id === 20 && (
                  <img src="/images/cloud-toast.png" alt="云朵吐司" className="w-20 h-20 mx-auto object-contain" />
                )}
                {bread.id === 21 && (
                  <img
                    src="/images/matcha-red-bean-toast.png"
                    alt="抹茶红豆吐司"
                    className="w-20 h-20 mx-auto object-contain"
                  />
                )}
              </div>

              <h2 className="text-lg font-bold text-[#3c3c43] mb-4">{bread.name}</h2>

              <div className="text-sm text-[#787880] leading-relaxed mb-6 space-y-2">
                {bread.id === 1 && (
                  <>
                    <p>巧克力藏在千层酥里</p>
                    <p>咬一口，甜到心尖上</p>
                  </>
                )}
                {bread.id === 2 && (
                  <>
                    <p>粉嫩外表下的甜蜜惊喜</p>
                    <p>草莓香气扑鼻而来</p>
                  </>
                )}
                {bread.id === 3 && (
                  <>
                    <p>清香开心果遇上丝滑奶油</p>
                    <p>每一口都是自然的馈赠</p>
                  </>
                )}
                {bread.id === 10 && (
                  <>
                    <p>全麦营养，健康首选</p>
                    <p>粗粮香味，自然纯朴</p>
                  </>
                )}
                {bread.id === 11 && (
                  <>
                    <p>酸甜蔓越莓遇上奶香乳酪</p>
                    <p>层次丰富的美味体验</p>
                  </>
                )}
                {bread.id === 12 && (
                  <>
                    <p>浓郁巧克力，甜蜜诱惑</p>
                    <p>每一口都是幸福滋味</p>
                  </>
                )}
                {bread.id === 13 && (
                  <>
                    <p>日式抹茶清香配红豆甜蜜</p>
                    <p>和谐统一的经典组合</p>
                  </>
                )}
                {bread.id === 14 && (
                  <>
                    <p>香浓黑芝麻，营养满分</p>
                    <p>传统风味的现代演绎</p>
                  </>
                )}
                {bread.id === 15 && (
                  <>
                    <p>香甜芋泥，口感绵密</p>
                    <p>紫色浪漫，视觉享受</p>
                  </>
                )}
                {bread.id === 16 && (
                  <>
                    <p>毛毛虫造型，萌趣可爱</p>
                    <p>奶油香甜，松软如云</p>
                  </>
                )}
                {bread.id === 17 && (
                  <>
                    <p>传统红豆馅，香甜醇厚</p>
                    <p>日式经典，温暖人心</p>
                  </>
                )}
                {bread.id === 18 && (
                  <>
                    <p>椰香浓郁，热带风情</p>
                    <p>层次丰富，甜蜜诱人</p>
                  </>
                )}
                {bread.id === 19 && (
                  <>
                    <p>岩烧工艺，乳酪香浓</p>
                    <p>奶香四溢，口感丰富</p>
                  </>
                )}
                {bread.id === 20 && (
                  <>
                    <p>轻盈如云，入口即化</p>
                    <p>极致柔软，天使般享受</p>
                  </>
                )}
                {bread.id === 21 && (
                  <>
                    <p>抹茶清香配红豆甜蜜</p>
                    <p>日式经典的完美结合</p>
                  </>
                )}
              </div>

              <div className="text-xs text-[#787880] opacity-70 italic">-lucky bread-</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ResultScreen = () => {
    const toggleFavorite = (breadId: number) => {
      setFavorites((prev) => (prev.includes(breadId) ? prev.filter((id) => id !== breadId) : [...prev, breadId]))
    }

    const handleCardClick = (bread: any) => {
      setSelectedBread(bread)
      setShowDetailModal(true)
    }

    const handleTutorialClick = (bread: any) => {
      initializeTutorialChat(bread)
      setCurrentScreen("tutorial")
    }

    return (
      <div
        className="min-h-screen relative pb-20"
        style={{
          backgroundImage: "url('/images/result-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <StatusBar />
        <div className="px-6 py-2">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#3c3c43] mb-2">幸运面包</h1>
            <p className="text-sm text-[#787880] mb-1">轻松一抽</p>
            <p className="text-xs text-[#999999]">发现你的下一款心头好！</p>
          </div>

          <div className="space-y-3 mb-4">
            {/* Chocolate Croissant Card */}
            <Card
              className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-r from-[#fff6cc] to-[#f9f0b8] border-0 shadow-lg relative"
              style={{
                background: "linear-gradient(135deg, #fff6cc 0%, #f9f0b8 50%, #fff6cc 100%)",
                boxShadow: "0 8px 32px rgba(253, 192, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                borderRadius: "20px",
              }}
              onClick={() =>
                handleCardClick({
                  id: 1,
                  name: "巧克力可颂",
                  emoji: "🥐",
                  color: "#fff6cc",
                  description: "巧克力魔法在千层酥里咬一口，甜到心头上",
                })
              }
            >
              <CardContent className="flex items-center p-5 pr-16">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border-0 shadow-inner overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, #f0e6b8, #e6d89a)",
                      boxShadow: "inset 2px 2px 8px rgba(0,0,0,0.1), inset -2px -2px 8px rgba(255,255,255,0.8)",
                    }}
                  >
                    <img src="/images/chocolate-croissant.png" alt="巧克力可颂" className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#3c3c43] mb-1">巧克力可颂</h3>
                    <p className="text-xs text-[#787880]">香甜酥脆，浓郁巧克力</p>
                  </div>
                </div>
              </CardContent>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <Button
                  size="sm"
                  className="bg-[#fdc03c] hover:bg-[#f4b942] text-white px-2 py-1 rounded-full text-xs font-bold shadow-md h-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTutorialClick({
                      id: 1,
                      name: "巧克力可颂",
                      emoji: "🥐",
                      color: "#fff6cc",
                    })
                  }}
                >
                  教程
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`p-1 rounded-full transition-colors h-6 w-6 ${
                    favorites.includes(1) ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(1)
                  }}
                >
                  <Heart size={12} fill={favorites.includes(1) ? "currentColor" : "none"} />
                </Button>
              </div>
            </Card>

            {/* Strawberry Pretzel Card */}
            <Card
              className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-r from-[#fbc9d6] to-[#f5b3c4] border-0 shadow-lg relative"
              style={{
                background: "linear-gradient(135deg, #fbc9d6 0%, #f5b3c4 50%, #fbc9d6 100%)",
                boxShadow: "0 8px 32px rgba(251, 201, 214, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                borderRadius: "20px",
              }}
              onClick={() =>
                handleCardClick({
                  id: 2,
                  name: "草莓碱水包",
                  emoji: "🥖",
                  color: "#fbc9d6",
                  description: "粉嫩可爱的草莓碱水包香甜滋味，少女心满满",
                })
              }
            >
              <CardContent className="flex items-center p-5 pr-16">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border-0 shadow-inner overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, #f5b3c4, #f0a3b8)",
                      boxShadow: "inset 2px 2px 8px rgba(0,0,0,0.1), inset -2px -2px 8px rgba(255,255,255,0.8)",
                    }}
                  >
                    <img src="/images/strawberry-pretzel.png" alt="草莓碱水包" className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#3c3c43] mb-1">草莓碱水包</h3>
                    <p className="text-xs text-[#787880]">粉嫩可爱，香甜滋味</p>
                  </div>
                </div>
              </CardContent>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <Button
                  size="sm"
                  className="bg-[#e91e63] hover:bg-[#d81b60] text-white px-2 py-1 rounded-full text-xs font-bold shadow-md h-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTutorialClick({
                      id: 2,
                      name: "草莓碱水包",
                      emoji: "🥖",
                      color: "#fbc9d6",
                    })
                  }}
                >
                  教程
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`p-1 rounded-full transition-colors h-6 w-6 ${
                    favorites.includes(2) ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(2)
                  }}
                >
                  <Heart size={12} fill={favorites.includes(2) ? "currentColor" : "none"} />
                </Button>
              </div>
            </Card>

            {/* Pistachio Cream Roll Card */}
            <Card
              className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-r from-[#d8eec9] to-[#c8e4b5] border-0 shadow-lg relative"
              style={{
                background: "linear-gradient(135deg, #d8eec9 0%, #c8e4b5 50%, #d8eec9 100%)",
                boxShadow: "0 8px 32px rgba(216, 238, 201, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                borderRadius: "20px",
              }}
              onClick={() =>
                handleCardClick({
                  id: 3,
                  name: "开心果奶油卷",
                  emoji: "🍞",
                  color: "#d8eec9",
                  description: "清香开心果奶油卷绿色健康，口感丰富层次",
                })
              }
            >
              <CardContent className="flex items-center p-5 pr-16">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border-0 shadow-inner overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, #c8e4b5, #b8daa1)",
                      boxShadow: "inset 2px 2px 8px rgba(0,0,0,0.1), inset -2px -2px 8px rgba(255,255,255,0.8)",
                    }}
                  >
                    <img
                      src="/images/pistachio-cream-roll.png"
                      alt="开心果奶油卷"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#3c3c43] mb-1">开心果奶油卷</h3>
                    <p className="text-xs text-[#787880]">清香开心果，丰富层次</p>
                  </div>
                </div>
              </CardContent>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <Button
                  size="sm"
                  className="bg-[#4caf50] hover:bg-[#45a049] text-white px-2 py-1 rounded-full text-xs font-bold shadow-md h-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTutorialClick({
                      id: 3,
                      name: "开心果奶油卷",
                      emoji: "🍞",
                      color: "#d8eec9",
                    })
                  }}
                >
                  教程
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`p-1 rounded-full transition-colors h-6 w-6 ${
                    favorites.includes(3) ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(3)
                  }}
                >
                  <Heart size={12} fill={favorites.includes(3) ? "currentColor" : "none"} />
                </Button>
              </div>
            </Card>
          </div>

          {/* Speech Bubble */}
          <div className="flex justify-center mb-3">
            <div
              className="relative bg-white rounded-2xl px-4 py-2 shadow-lg"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              <p className="text-sm text-[#787880]">三款推荐已到货，总有一款合你胃口！</p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
            </div>
          </div>

          {/* Bread Character */}
          <div className="flex justify-center mb-6">
            <img src="/images/bread-character.png" alt="面包精灵" className="w-20 h-20 object-contain" />
          </div>

          {/* Draw Again Button */}
          <div className="flex justify-center mb-4">
            <Button
              onClick={() => setCurrentScreen("lottery")}
              className="bg-gradient-to-b from-[#fdc03c] to-[#f4b942] hover:from-[#f4b942] hover:to-[#fdc03c] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-[#bf6b3c]"
            >
              再抽一次
            </Button>
          </div>
        </div>
        <BottomNav />

        {/* Detail Modal */}
        {showDetailModal && selectedBread && (
          <DetailModal bread={selectedBread} onClose={() => setShowDetailModal(false)} />
        )}
      </div>
    )
  }

  const TutorialScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8d4] to-[#f5edc4] pb-20">
      <StatusBar />
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fdc03c] to-[#f4b942] flex items-center justify-center overflow-hidden">
              <img src="/images/bread-assistant.png" alt="面包小助手" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-[#3c3c43]">面包小助手</h2>
              <p className="text-xs text-[#787880]">
                {tutorialBread ? `${tutorialBread.name}制作教程` : "面包制作专家"}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-4 min-h-[350px] max-h-[350px] overflow-y-auto">
          <div className="space-y-4">
            {chatMessages.length === 0 && !tutorialBread && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mb-4 mx-auto">
                  <img src="/images/bread-assistant.png" alt="面包小助手" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-bold text-[#3c3c43] mb-2">欢迎来到面包教程！</h3>
                <p className="text-sm text-[#787880] mb-4">我是你的面包制作小助手</p>
                <p className="text-xs text-[#999999] mb-6">搜索你想学习的面包类型，或选择热门教程开始学习</p>

                {/* 热门教程推荐 */}
                <div className="space-y-3 max-w-xs mx-auto">
                  <h4 className="text-sm font-bold text-[#3c3c43] mb-3">🔥 当前热门教程</h4>
                  <Button
                    onClick={() => {
                      const bread = { id: 1, name: "巧克力可颂", emoji: "🥐", color: "#fff6cc" }
                      initializeTutorialChat(bread)
                    }}
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-[#fff6cc] to-[#f9f0b8] border-[#fdc03c] hover:bg-gradient-to-r hover:from-[#f9f0b8] hover:to-[#fff6cc]"
                  >
                    <span className="mr-2">🥐</span>
                    巧克力可颂制作教程
                  </Button>
                  <Button
                    onClick={() => {
                      const bread = { id: 2, name: "草莓碱水包", emoji: "🥖", color: "#fbc9d6" }
                      initializeTutorialChat(bread)
                    }}
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-[#fbc9d6] to-[#f5b3c4] border-[#e91e63] hover:bg-gradient-to-r hover:from-[#f5b3c4] hover:to-[#fbc9d6]"
                  >
                    <span className="mr-2">🥖</span>
                    草莓碱水包制作教程
                  </Button>
                  <Button
                    onClick={() => {
                      const bread = { id: 3, name: "开心果奶油卷", emoji: "🍞", color: "#d8eec9" }
                      initializeTutorialChat(bread)
                    }}
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-[#d8eec9] to-[#c8e4b5] border-[#4caf50] hover:bg-gradient-to-r hover:from-[#c8e4b5] hover:to-[#d8eec9]"
                  >
                    <span className="mr-2">🍞</span>
                    开心果奶油卷制作教程
                  </Button>
                </div>
              </div>
            )}

            {chatMessages.length === 0 && tutorialBread && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🍞</div>
                <h3 className="text-lg font-bold text-[#3c3c43] mb-2">欢迎来到面包教程！</h3>
                <p className="text-sm text-[#787880] mb-4">我是你的面包制作小助手</p>
                <p className="text-xs text-[#999999]">开始学习{tutorialBread.name}的制作方法吧！</p>
              </div>
            )}

            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                  {message.type === "bot" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#fdc03c] to-[#f4b942] flex items-center justify-center overflow-hidden">
                        <img src="/images/bread-assistant.png" alt="面包小助手" className="w-4 h-4 object-contain" />
                      </div>
                      <span className="text-xs text-[#787880]">面包小助手</span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === "user" ? "bg-[#007aff] text-white" : "bg-white shadow-sm border border-gray-100"
                    }`}
                  >
                    <p
                      className={`text-sm leading-relaxed whitespace-pre-line ${
                        message.type === "user" ? "text-white" : "text-[#3c3c43]"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                  <div
                    className={`text-xs text-[#999999] mt-1 ${message.type === "user" ? "text-right" : "text-left"}`}
                  >
                    {message.timestamp.toLocaleTimeString("zh-CN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#fdc03c] to-[#f4b942] flex items-center justify-center overflow-hidden">
                      <img src="/images/bread-assistant.png" alt="面包小助手" className="w-4 h-4 object-contain" />
                    </div>
                    <span className="text-xs text-[#787880]">面包小助手</span>
                  </div>
                  <div className="bg-white shadow-sm border border-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#999999] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#999999] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#999999] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={tutorialBread ? `询问${tutorialBread.name}制作问题...` : "搜索面包类型或询问制作问题..."}
              className="flex-1 rounded-full border-gray-300 focus:border-[#007aff] focus:ring-[#007aff]"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="rounded-full w-10 h-10 p-0 bg-[#007aff] hover:bg-[#007aff]/90"
            >
              <Send size={16} />
            </Button>
          </div>

          {tutorialBread ? (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setInputMessage("开始教程")}
              >
                开始教程
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setInputMessage("需要什么材料")}
              >
                需要什么材料
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setInputMessage("发酵技巧")}
              >
                发酵技巧
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setInputMessage("烘烤温度")}
              >
                烘烤温度
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setInputMessage("巧克力面包怎么做")}
              >
                巧克力面包怎么做
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setInputMessage("法式面包制作")}
              >
                法式面包制作
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setInputMessage("抹茶面包教程")}
              >
                抹茶面包教程
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setInputMessage("新手入门教程")}
              >
                新手入门教程
              </Button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )

  const ProfileScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8d4] to-[#f5edc4] pb-20">
      <StatusBar />
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#3c3c43] mb-4">我的收藏</h1>
          <div className="text-4xl mb-4">👤</div>
          <p className="text-sm text-[#787880]">面包爱好者</p>
        </div>

        <div className="space-y-4">
          <Card className="bg-white/80">
            <CardContent className="p-4">
              <h3 className="font-bold text-[#3c3c43] mb-2">收藏统计</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#fdc03c]">12</div>
                  <div className="text-xs text-[#787880]">收藏配方</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#bf6b3c]">8</div>
                  <div className="text-xs text-[#787880]">制作完成</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#a7ce8c]">5</div>
                  <div className="text-xs text-[#787880]">分享次数</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80">
            <CardContent className="p-4">
              <h3 className="font-bold text-[#3c3c43] mb-4">最近收藏</h3>
              <div className="space-y-3">
                {breadTypes.map((bread) => (
                  <div key={bread.id} className="flex items-center gap-3">
                    <div className="text-2xl">{bread.emoji}</div>
                    <div className="flex-1">
                      <div className="font-medium text-[#3c3c43]">{bread.name}</div>
                      <div className="text-xs text-[#787880]">2小时前收藏</div>
                    </div>
                    <Heart size={16} className="text-[#fb93ae]" fill="currentColor" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  )

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative overflow-hidden">
      {currentScreen === "splash" && <SplashScreen />}
      {currentScreen === "home" && <HomeScreen />}
      {currentScreen === "lottery" && <LotteryScreen />}
      {currentScreen === "collection" && <CollectionScreen />}
      {currentScreen === "detail" && <DetailScreen />}
      {currentScreen === "result" && <ResultScreen />}
      {currentScreen === "tutorial" && <TutorialScreen />}
      {currentScreen === "profile" && <ProfileScreen />}
    </div>
  )
}
