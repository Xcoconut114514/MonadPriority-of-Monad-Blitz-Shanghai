import { defineChain } from "thirdweb";

export const HOST_CONFIG = {
  // 你的 Telegram 用户名
  username: "@xcoconut1145", 
  
  // 🔴 你的收款钱包地址 (已更新)
  walletAddress: "0x3f2f84d6aee437f1724e36d00554bf435938eaa5", 
  
  // 默认头像 (你可以换成你的 GitHub 头像链接或者其他图片链接)
  avatarUrl: "https://avatars.githubusercontent.com/u/0?v=4", 
  
  // 默认价格
  defaultPrice: "0.1" 
};

// 🌟 官方参数配置 (保持不变，确保能连接钱包) 🌟
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpc: "https://testnet-rpc.monad.xyz/", // 官方 RPC
  blockExplorers: [
    {
      name: "MonadExplorer",
      url: "https://testnet.monadexplorer.com/", // 官方浏览器
      apiUrl: "https://testnet.monadexplorer.com/api",
    },
  ],
  testnet: true,
});