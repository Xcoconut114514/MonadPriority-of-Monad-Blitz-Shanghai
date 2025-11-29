import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- Icons (SVG as Components for 8-bit feel) ---
const IconRocket = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
);

const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h2v-4Z"/></svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" className="text-green-400"><path d="M20 6 9 17l-5-5"/></svg>
);

// --- Components ---

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
    cyber: "bg-cyber-pink text-white shadow-pixel hover:bg-[#ff4d9e]"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </button>
  );
};

const PixelInput = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-monad-ice uppercase tracking-widest mb-1">{label}</label>
    <input 
      {...props}
      className="w-full bg-gray-900 border-4 border-gray-700 text-white p-4 font-pixel text-sm focus:outline-none focus:border-monad-purple focus:shadow-[0_0_10px_rgba(131,110,249,0.5)] placeholder-gray-600 transition-colors"
    />
  </div>
);

const PixelSelect = ({ label, options, value, onChange }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-monad-ice uppercase tracking-widest mb-1">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={onChange}
        className="w-full bg-gray-900 border-4 border-gray-700 text-white p-4 font-pixel text-sm focus:outline-none focus:border-monad-purple appearance-none cursor-pointer"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-monad-purple">
        ▼
      </div>
    </div>
  </div>
);

const PixelTextarea = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-monad-ice uppercase tracking-widest mb-1">{label}</label>
    <textarea 
      {...props}
      rows={5}
      className="w-full bg-gray-900 border-4 border-gray-700 text-white p-4 font-pixel text-sm focus:outline-none focus:border-monad-purple focus:shadow-[0_0_10px_rgba(131,110,249,0.5)] placeholder-gray-600 resize-none transition-colors"
    />
  </div>
);

const PixelCounter = ({ label, value, onChange }: any) => {
  const updateValue = (newValue: string | number) => {
    // Prevent negative numbers on manual input
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

// --- Main App ---

const MonadPriorityMail = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [coinAmount, setCoinAmount] = useState<string | number>(1);
  
  // This should be configurable or come from environment variables in a real app
  const RECIPIENT_HANDLE = "@Monad_Dev";

  const [formData, setFormData] = useState({
    platform: "Twitter",
    username: "",
    message: ""
  });

  const handleConnect = () => {
    // Simulation of Thirdweb Connect
    setWalletConnected(true);
    setWalletAddress("0x71C...9A21");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) return;

    setStatus("loading");
    
    const numericAmount = parseFloat(coinAmount.toString()) || 0;

    // Simulating API call and Payment
    // In a real app, this would call /api/send-dm
    try {
      console.log(`Simulating x402 payment of ${numericAmount} MON...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Payment confirmed. Sending payload:", { ...formData, amount: numericAmount });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <PixelCard className="max-w-md w-full text-center py-12">
          <div className="flex justify-center mb-6">
            <IconCheck />
          </div>
          <h2 className="text-xl text-green-400 mb-4 leading-relaxed">TRANSMISSION<br/>COMPLETE</h2>
          <p className="text-xs text-gray-400 mb-8 leading-6">
            Your message has been encrypted and beamed directly to the recipient.
          </p>
          <PixelButton onClick={() => setStatus("idle")} variant="secondary">
            SEND ANOTHER
          </PixelButton>
        </PixelCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 bg-grid-pattern flex flex-col items-center pt-32 pb-12 px-4">
      
      {/* Header */}
      <header className="mb-16 text-center space-y-8">
        <h1 className="text-3xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-monad-ice to-monad-purple drop-shadow-[6px_6px_0_rgba(0,0,0,1)] tracking-tighter">
          MONAD PRIORITY
        </h1>
        {/* Updated Slogan Rotation Logic: Straight by default (rotate-0), crooked on hover (-rotate-2) */}
        <div className="inline-block bg-black px-6 py-3 border-4 border-gray-700 transform rotate-0 hover:-rotate-3 transition-transform duration-200">
          <p className="text-[10px] md:text-sm text-arcade-red animate-blink tracking-widest font-bold">
            Insert Coin to Chat // X402
          </p>
        </div>
      </header>

      {/* Main Interface */}
      <div className="w-full max-w-2xl relative">
        {/* Decorative elements behind */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-monad-purple opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-cyber-blue opacity-20 blur-2xl"></div>

        <PixelCard>
          {/* Header section with reduced margin and padding */}
          <div className="flex justify-between items-center mb-6 border-b-4 border-gray-800 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-white font-bold tracking-wider">GATEWAY_V.1.0</span>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-1">
                 <span className="text-[10px] text-gray-500">PAY TO:</span>
                 <span className="text-xs text-monad-purple font-bold border-2 border-monad-purple bg-gray-900 px-2 py-0.5">{RECIPIENT_HANDLE}</span>
              </div>
            </div>
            
            {!walletConnected ? (
              <button 
                onClick={handleConnect}
                className="flex items-center gap-2 text-[10px] md:text-xs bg-red-500 hover:bg-red-600 text-white px-4 py-3 border-4 border-black shadow-pixel-sm transition-transform active:translate-y-0.5 active:shadow-none font-bold"
              >
                <IconWallet /> CONNECT WALLET
              </button>
            ) : (
              <div className="flex items-center gap-2 text-[10px] md:text-xs bg-green-600 text-white px-4 py-3 border-4 border-black shadow-pixel-sm">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-blink"></div>
                {walletAddress}
              </div>
            )}
          </div>

          {/* Form section with reduced gap */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PixelSelect 
                label="Platform" 
                options={["Twitter", "Telegram", "Discord", "Farcaster"]} 
                value={formData.platform}
                onChange={(e: any) => setFormData({...formData, platform: e.target.value})}
              />
              <PixelInput 
                label="Username" 
                placeholder="@username"
                value={formData.username}
                onChange={(e: any) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <PixelTextarea 
              label="Message Payload" 
              placeholder="Write your priority message here..."
              value={formData.message}
              onChange={(e: any) => setFormData({...formData, message: e.target.value})}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
               <PixelCounter 
                  label="Insert Amount"
                  value={coinAmount}
                  onChange={setCoinAmount}
               />
               
               <div>
                  <PixelButton 
                    className="w-full flex items-center justify-center gap-3 text-sm md:text-base py-5 h-[88px]" 
                    disabled={!walletConnected || status === 'loading'}
                    variant={walletConnected ? "primary" : "secondary"}
                  >
                    {status === 'loading' ? (
                      <span className="animate-blink">PROCESSING...</span>
                    ) : (
                      <>
                        <div className="flex flex-col items-start leading-tight">
                          <span className="text-[10px] opacity-80">SEND MESSAGE</span>
                          <span>INSERT {coinAmount || 0} MON 🚀</span>
                        </div>
                      </>
                    )}
                  </PixelButton>
               </div>
            </div>
              
              {!walletConnected && (
                <p className="text-[10px] text-red-400 text-center -mt-2">
                  * PLEASE CONNECT WALLET TO OPERATE
                </p>
              )}
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

const root = createRoot(document.getElementById('root')!);
root.render(<MonadPriorityMail />);