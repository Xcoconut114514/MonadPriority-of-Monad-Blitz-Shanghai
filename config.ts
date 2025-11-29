// monad-priority/config.ts
import { defineChain } from "thirdweb";

// 你的个人配置 (部署前请修改这里)
export const HOST_CONFIG = {
  // 你的 Telegram 用户名 (用于前端展示)
  username: "@NeoHacker", 
  
  // 你的收款钱包地址 (建议使用专用小号，不要用主钱包)
  walletAddress: "0x1234567890123456789012345678901234567890", 
  
  // 你的头像链接
  avatarUrl: "https://avatars.githubusercontent.com/u/12345678?v=4",
  
  // 默认私信价格 (单位 MON)
  defaultPrice: "0.1"
};

// Monad Testnet 链定义
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpc: "https://testnet-rpc.monad.xyz",
  testnet: true,
});