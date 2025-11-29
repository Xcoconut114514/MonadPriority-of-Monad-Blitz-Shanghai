

# 👾 Monad Priority Mail (MPM)

> **Insert Coin to Chat.** 基于 Monad x402 协议的去中心化“付费私信”网关。

  

## 📖 项目简介 (Introduction)

**Monad Priority Mail** 是一个抗垃圾信息（Anti-Spam）的 Web3 通讯网关。它利用 **Monad 区块链** 的极速确认特性和 **x402 (HTTP 402 Payment Required)** 协议，构建了一个“经济博弈”的私信系统。

在 Web2 时代，名人和开发者的私信（DM）充斥着垃圾信息。MPM 通过引入微支付门槛（如 0.1 MON），通过经济成本筛选出真正有价值的信息，并利用 Telegram 机器人实现即时的高优先级通知。

**核心理念：** *Proof of Attention via Economic Stake (通过经济质押证明注意力价值)*。

## ✨ 核心特性 (Key Features)

  * **⚡ 极速支付 (Monad Speed)**: 利用 Monad Testnet 的亚秒级出块，支付体验如同街机投币般流畅，无需漫长等待。
  * **🛡️ x402 原生协议**: 不依赖传统的 Web2 订阅，完全基于 HTTP 402 标准的“按次付费”接口，实现无许可的价值交换。
  * **🤖 Telegram 实时通知**: 支付确认后，后端立即调用 Bot API，将消息推送到接收者的手机，包含交易哈希验证。
  * **🎨 赛博像素风 (Cyberpunk Pixel UI)**: 独特的 8-bit 复古街机视觉风格，致敬极客文化。
  * **🔒 真实链上交互**: 集成 Thirdweb SDK v5 和 MetaMask，每一条消息都对应一笔真实的链上交易。

## 🛠️ 技术栈 (Tech Stack)

  * **前端**: React, Vite, Tailwind CSS (Pixel Art Design)
  * **Web3 接入**: Thirdweb SDK v5 (ConnectButton, wrapFetchWithPayment)
  * **后端/API**: Vercel Serverless Functions (Node.js)
  * **支付验证**: Thirdweb x402 Facilitator & SettlePayment
  * **通知服务**: Telegram Bot API
  * **网络**: Monad Testnet (Chain ID: 10143)

## 🔄 工作流程 (Architecture)

1.  **用户访问**: 访问者打开你的 MPM 专属链接（如 `monad-priority.vercel.app`）。
2.  **连接钱包**: 用户点击像素按钮连接 MetaMask，自动切换至 Monad Testnet。
3.  **发送请求**: 用户填写消息并点击发送。前端拦截请求，发现 API 需要付费（HTTP 402）。
4.  **链上支付**: Thirdweb SDK 自动唤起钱包，用户签署并支付 MON 代币。
5.  **后端验证**: 服务器接收到带有支付证明的请求，通过 Monad RPC 验证交易真实性。
6.  **服务交付**: 验证通过后，后端机器人立即向博主的 Telegram 发送格式化的消息通知。

## 🚀 快速开始 (Getting Started)

### 1\. 本地运行

```bash
# 克隆仓库
git clone https://github.com/YourUsername/monad-priority.git
cd monad-priority

# 安装依赖 (必须包含 thirdweb)
npm install

# 配置环境变量
# 在根目录创建 .env 文件，填入以下内容：
# VITE_THIRDWEB_CLIENT_ID=your_client_id
# THIRDWEB_SECRET_KEY=your_secret_key
# TG_BOT_TOKEN=your_bot_token
# TG_CHAT_ID=your_chat_id
# HOST_WALLET_ADDRESS=your_wallet_address

# 启动开发服务器
npm run dev
```

### 2\. 部署到 Vercel

本项目已针对 Vercel 进行了深度优化（包含 `vercel.json` 配置）。

1.  Fork 本仓库到你的 GitHub。
2.  在 Vercel 导入项目。
3.  **重要**：在 Vercel 项目设置中填入以下环境变量：
      * `VITE_THIRDWEB_CLIENT_ID`
      * `THIRDWEB_SECRET_KEY`
      * `TG_BOT_TOKEN`
      * `TG_CHAT_ID`
      * `HOST_WALLET_ADDRESS`
4.  点击 Deploy，即可获得生产环境链接。

## 📸 演示截图 (Demo)

<img width="1920" height="1200" alt="c66420589aec3118c7e20e010093336f" src="https://github.com/user-attachments/assets/be88083b-32f3-4d7c-b393-ebd74d499e20" />


-----

## 🏆 Hackathon 亮点 (Why Monad Blitz?)

  * **Monad Native**: 专为高吞吐量环境设计，展示了 Monad 处理高频微支付的潜力。
  * **x402 Implementation**: 完整实现了 HTTP 402 协议的客户端与服务端闭环，是 Web3 支付标准的最佳实践。
  * **User Experience**: 从支付到 Telegram 收到消息仅需数秒，体现了 Monad 生态的流畅性。

## 📄 许可证

MIT License. Free to fork and build your own priority gateway\!

-----

**Made with 💜 for Monad Blitz Hackathon.**
