import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, ConnectButton, useActiveWallet } from "thirdweb/react";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { HOST_CONFIG, monadTestnet } from "./config"; 

// 🔴 修复钱包导入路径：使用更通用的 thirdweb/wallets 路径
// 如果此路径依然报错，请确认运行了 npm install @thirdweb-dev/wallets
import { metamaskWallet, coinbaseWallet, rainbowWallet } from "thirdweb/wallets";

const client = createThirdwebClient({ 
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "YOUR_CLIENT_ID" 
});

const wallets = [
    metamaskWallet(),
    coinbaseWallet(),
    rainbowWallet(),
];

// --- 保持所有 UI 组件不变 (代码省略，使用你的本地文件) ---

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" className="text-green-400"><path d="M20 6 9 17l-5-5"/></svg>
);
// ... [PixelButton, PixelCard, PixelInput, etc. 保持你本地代码]

// --- 核心业务组件 ---
const MonadPriorityMail = () => {
  const wallet = useActiveWallet();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState("");
  const [coinAmount, setCoinAmount] = useState<string | number>(HOST_CONFIG.defaultPrice);
  
  const [formData, setFormData] = useState({
    platform: "Twitter",
    username: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return alert("Please connect wallet first!");

    setStatus("loading");
    
    try {
      const fetchWithPay = wrapFetchWithPayment(fetch, client, wallet);

      const res = await fetchWithPay("/api/send-dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: coinAmount
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTxHash(data.tx || "");
        setStatus("success");
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Payment failed:", errorData);
        alert("Transaction failed or cancelled.");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  // ... [渲染部分保持你本地代码] ...

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 bg-grid-pattern flex flex-col items-center pt-32 pb-12 px-4 font-pixel">
      {/* ... [其他 UI 元素保持不变] */}
      
      <div className="w-full max-w-2xl relative">
        <PixelCard>
          <div className="flex justify-between items-center mb-6 border-b-4 border-gray-800 pb-4">
            {/* ... [Host Info 保持不变] */}
            
            <div>
               <ConnectButton 
                 client={client} 
                 chain={monadTestnet}
                 wallets={wallets} // 使用修复后的 wallets 数组
                 theme={"dark"}
                 connectButton={{ 
                   label: "CONNECT WALLET", 
                   className: "!font-pixel !text-[10px] !border-4 !border-black !rounded-none !bg-red-500 hover:!bg-red-600 !shadow-pixel-sm" 
                 }} 
               />
            </div>
          </div>
          {/* ... [Form 和 Footer 保持不变] */}
        </PixelCard>
      </div>
      {/* ... [Footer 保持不变] */}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ThirdwebProvider>
      <MonadPriorityMail />
    </ThirdwebProvider>
  );
}