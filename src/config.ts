import { defineChain } from "thirdweb";

export const HOST_CONFIG = {
  username: "@NeoHacker", // 你的 Telegram 用户名
  // 🔴 重点：去 MetaMask 建个小号，把地址填在这里！
  walletAddress: "0x1234567890123456789012345678901234567890", 
  avatarUrl: "https://avatars.githubusercontent.com/u/12345678?v=4", // 你的头像
  defaultPrice: "0.1" // 默认价格
};

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpc: "https://testnet-rpc.monad.xyz",
  testnet: true,
});