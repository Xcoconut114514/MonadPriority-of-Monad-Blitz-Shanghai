import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";

// 修正：使用正确的 chain ID 常量
const MONAD_CHAIN_ID = 10143; 

// 创建服务端 Client
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

export default async function handler(req, res) {
  // CORS 设置
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-payment, x-thirdweb-client-id'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body;
    const { platform, username, message, amount } = body;

    const recipientAddress = process.env.HOST_WALLET_ADDRESS;
    if (!recipientAddress) {
      return res.status(500).json({ error: "Server Misconfiguration: HOST_WALLET_ADDRESS missing" });
    }

    // --- 核心验证逻辑 ---
    const twFacilitator = facilitator({
      client,
      serverWalletAddress: recipientAddress, 
    });

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'];
    const resourceUrl = `${protocol}://${host}/api/send-dm`;
    const paymentData = req.headers['x-payment'];

    // 修复 TS(2353) 错误：price 参数已正确设置，不再需要额外的 'currency' 属性。
    const paymentResult = await settlePayment({
      client, // 这里的 client 是必要的
      paymentData: paymentData,
      resourceUrl: resourceUrl,
      method: "POST",
      price: amount || "0.1", 
      chainId: MONAD_CHAIN_ID,
      payTo: recipientAddress,
      facilitator: twFacilitator,
    });

    if (paymentResult.status !== 200) {
      return res.status(paymentResult.status).json(paymentResult.responseBody);
    }

    // --- 支付成功，发 Telegram ---
    const transactionHash = paymentResult.paymentReceipt.transaction;
    
    const botToken = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (botToken && chatId) {
      const text = `
<b>📨 NEW PRIORITY MAIL (PAID)</b>
--------------------------------
<b>Amount:</b> ${amount} MON 💰
<b>From:</b> ${platform} / ${username}
--------------------------------
<b>Message:</b>
<i>${message}</i>
--------------------------------
<b>Status:</b> ✅ Verified (Tx: ${transactionHash.slice(0, 8)}...)
      `.trim();

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
    }

    return res.status(200).json({ success: true, message: "Priority Mail Delivered!", tx: transactionHash });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}