import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, ConnectButton, useActiveWallet } from "thirdweb/react";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { HOST_CONFIG, monadTestnet } from "./config"; 

// 🌟 核心修复点 1：显式导入钱包连接器 🌟
import { inAppWallet, metamaskWallet, coinbaseWallet, rainbowWallet } from "thirdweb/wallets";

// 🌟 核心修复点 2：将 Client ID 暂时硬编码用于测试 🌟
// 请在这里填入你的真实 Thirdweb Client ID，以避免 Vite 环境变量读取失败
const client = createThirdwebClient({ 
  clientId: "你的_THIRDWEB_CLIENT_ID" // 替换成你真实的 Client ID
});

// 🌟 核心修复点 3：定义钱包数组 🌟
const wallets = [
    // 优先推荐 MetaMask，并确保它能连接到 Monad
    metamaskWallet(),
    coinbaseWallet(),
    rainbowWallet(),
    // inAppWallet({ auth: { options: ["email", "google", "apple"] } }) // 如果需要无助记词钱包
];


// --- Icons & Components (保持不变) ---
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" className="text-green-400"><path d="M20 6 9 17l-5-5"/></svg>
);

const PixelCard = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-gray-800 border-4 border-black shadow-pixel p-8 md:p-10 relative ${className}`}>
    <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-10"></div>
    <div className="absolute left-0 top-0 h-full w-1 bg-white opacity-10"></div>
    {children}
  </div>
);

const PixelButton = ({ children, onClick, disabled, variant = "primary", className = "" }: any) => {
  const baseStyle = "border-4 border-black px-6 py-4 font-bold text-sm uppercase transition-all transform active:translate-y-1 active:shadow-pixel-active disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-monad-purple text-white shadow-pixel hover:bg-[#9481FA]",
    secondary: "bg-gray-200 text-black shadow-pixel hover:bg-white",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

const PixelInput = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-monad-ice uppercase tracking-widest mb-1">{label}</label>
    <input {...props} className="w-full bg-gray-900 border-4 border-gray-700 text-white p-4 font-pixel text-sm focus:outline-none focus:border-monad-purple focus:shadow-[0_0_10px_rgba(131,110,249,0.5)] placeholder-gray-600 transition-colors" />
  </div>
);

const PixelSelect = ({ label, options, value, onChange }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-monad-ice uppercase tracking-widest mb-1">{label}</label>
    <div className="relative">
      <select value={value} onChange={onChange} className="w-full bg-gray-900 border-4 border-gray-700 text-white p-4 font-pixel text-sm focus:outline-none focus:border-monad-purple appearance-none cursor-pointer">
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-monad-purple">▼</div>
    </div>
  </div>
);

const PixelTextarea = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-monad-ice uppercase tracking-widest mb-1">{label}</label>
    <textarea {...props} rows={5} className="w-full bg-gray-900 border-4 border-gray-700 text-white p-4 font-pixel text-sm focus:outline-none focus:border-monad-purple focus:shadow-[0_0_10px_rgba(131,110,249,0.5)] placeholder-gray-600 resize-none transition-colors" />
  </div>
);

const PixelCounter = ({ label, value, onChange }: any) => {
  const updateValue = (newValue: string | number) => {
    if (typeof newValue === 'number' && newValue < 0) {
      onChange(0);
      return;
    }
    if (typeof newValue === 'string') {
        const parsed = parseFloat(newValue);
        if (!isNaN(parsed) && parsed < 0) {
            onChange(0);
            return;
        }
    }
    onChange(newValue);
  };
  const increment = () => {
    const current = parseFloat(value.toString()) || 0;
    updateValue(parseFloat((current + 1).toFixed(2)));
  };
  const decrement = () => {
    const current = parseFloat(value.toString()) || 0;
    const next = Math.max(0, current - 1);
    updateValue(parseFloat(next.toFixed(2)));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs text-monad-ice uppercase tracking-widest mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrement}
          className="w-14 h-14 bg-gray-800 border-4 border-gray-600 text-white font-pixel text-xl hover:bg-gray-700 active:translate-y-1 transition-colors flex items-center justify-center shrink-0"
        >-</button>
        <div className="flex-1 relative h-14 bg-gray-900 border-4 border-gray-700 shadow-inner">
          <input
            type="number"
            min="0"
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            className="w-full h-full bg-transparent text-monad-purple font-pixel text-sm md:text-base tracking-widest text-center focus:outline-none p-2"
            placeholder="0.0"
            step="any"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-monad-purple text-xs hidden md:block">MON</div>
        </div>
        <button
           type="button"
           onClick={increment}
           className="w-14 h-14 bg-gray-800 border-4 border-gray-600 text-white font-pixel text-xl hover:bg-gray-700 active:translate-y-1 transition-colors flex items-center justify-center shrink-0"
        >+</button>
      </div>
    </div>
  );
};

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

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <PixelCard className="max-w-md w-full text-center py-12">
          <div className="flex justify-center mb-6"><IconCheck /></div>
          <h2 className="text-xl text-green-400 mb-4 leading-relaxed font-pixel">TRANSMISSION<br/>COMPLETE</h2>
          <p className="text-xs text-gray-400 mb-4 leading-6 font-pixel">
            Verified by Thirdweb Facilitator.<br/>
            Sent via Monad Testnet.
          </p>
          {txHash && (
             <a href={`https://testnet.monadexplorer.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-monad-ice underline block mb-8">
               VIEW TRANSACTION
             </a>
          )}
          <PixelButton onClick={() => setStatus("idle")} variant="secondary">SEND ANOTHER</PixelButton>
        </PixelCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 bg-grid-pattern flex flex-col items-center pt-32 pb-12 px-4 font-pixel">
      <header className="mb-16 text-center space-y-8">
        <h1 className="text-3xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-monad-ice to-monad-purple drop-shadow-[6px_6px_0_rgba(0,0,0,1)] tracking-tighter">MONAD PRIORITY</h1>
        <div className="inline-block bg-black px-6 py-3 border-4 border-gray-700 transform rotate-0 hover:-rotate-3 transition-transform duration-200">
          <p className="text-[10px] md:text-sm text-arcade-red animate-blink tracking-widest font-bold">Insert Coin to Chat // X402</p>
        </div>
      </header>

      <div className="w-full max-w-2xl relative">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-monad-purple opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-cyber-blue opacity-20 blur-2xl"></div>

        <PixelCard>
          <div className="flex justify-between items-center mb-6 border-b-4 border-gray-800 pb-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 border-2 border-white overflow-hidden bg-gray-700">
                 <img src={HOST_CONFIG.avatarUrl} alt="Host" className="w-full h-full object-cover pixelated" />
               </div>
               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                   <span className="text-[10px] text-gray-500">PAYING TO:</span>
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 </div>
                 <span className="text-sm text-monad-purple font-bold tracking-wider">{HOST_CONFIG.username}</span>
                 <span className="text-[10px] text-gray-600 font-mono">ID: {HOST_CONFIG.walletAddress.slice(0,6)}...{HOST_CONFIG.walletAddress.slice(-4)}</span>
               </div>
            </div>
            
            <div>
               <ConnectButton 
                 client={client} 
                 chain={monadTestnet}
                 wallets={wallets} // 传递钱包数组
                 theme={"dark"}
                 connectButton={{ 
                   label: "CONNECT WALLET", 
                   className: "!font-pixel !text-[10px] !border-4 !border-black !rounded-none !bg-red-500 hover:!bg-red-600 !shadow-pixel-sm" 
                 }} 
               />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PixelSelect label="Platform" options={["Twitter", "Telegram", "Discord"]} value={formData.platform} onChange={(e: any) => setFormData({...formData, platform: e.target.value})} />
              <PixelInput label="Username" placeholder="@username" value={formData.username} onChange={(e: any) => setFormData({...formData, username: e.target.value})} />
            </div>
            <PixelTextarea label="Message Payload" placeholder="Write your priority message here..." value={formData.message} onChange={(e: any) => setFormData({...formData, message: e.target.value})} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
               <PixelCounter label="Insert Amount" value={coinAmount} onChange={setCoinAmount} />
               <div>
                  <PixelButton className="w-full flex items-center justify-center gap-3 text-sm md:text-base py-5 h-[88px]" disabled={!wallet || status === 'loading'} variant={wallet ? "primary" : "secondary"}>
                    {status === 'loading' ? <span className="animate-blink">PROCESSING...</span> : <span>INSERT {coinAmount || 0} MON 🚀</span>}
                  </PixelButton>
               </div>
            </div>
            {!wallet && <p className="text-[10px] text-red-400 text-center -mt-2">* PLEASE CONNECT WALLET TO OPERATE</p>}
          </form>
        </PixelCard>
      </div>

      <footer className="mt-20 text-center text-[10px] text-gray-600 space-y-2">
        <p>POWERED BY MONAD TESTNET & X402 PROTOCOL</p>
        <p>© 2024 CYBER_GATEWAY_SYSTEMS</p>
      </footer>
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