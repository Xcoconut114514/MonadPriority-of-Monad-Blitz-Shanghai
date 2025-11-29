import { settlePayment } from "thirdweb/payment";
import { defineChain } from "thirdweb";

// 定义 Monad Testnet
const MONAD_CHAIN_ID = 10143;

// Vercel Serverless Function 标准写法 (Node.js)
export default async function handler(req, res) {
  // 1. 设置 CORS (防止跨域报错)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { platform, username, message, amount } = req.body;

    // 获取收款地址
    const recipientAddress = process.env.HOST_WALLET_ADDRESS;
    if (!recipientAddress) {
      console.error("HOST_WALLET_ADDRESS not set");
      return res.status(500).json({ error: "Server Misconfiguration" });
    }

    // 2. --- x402 核心验证 ---
    // 这里的 req 和 res 直接传给 settlePayment
    const paymentResult = await settlePayment({
      req,
      res,
      price: amount || "0.1",
      currency: "MON",
      chainId: MONAD_CHAIN_ID,
      recipientAddress: recipientAddress,
    });

    // 如果验证不通过 (settlePayment 内部会处理返回，但为了保险我们手动判断状态)
    if (paymentResult.status !== 200) {
      // paymentResult.body 包含了需要的支付参数
      return res.status(paymentResult.status).json(paymentResult.body);
    }

    // 3. --- 支付成功，发 Telegram ---
    const botToken = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(200).json({ success: true, warning: "Payment received, but notification failed (Config Error)." });
    }

    const text = `
<b>📨 NEW PRIORITY MAIL (PAID)</b>
--------------------------------
<b>Amount:</b> ${amount} MON 💰
<b>From:</b> ${platform} / ${username}
--------------------------------
<b>Message:</b>
<i>${message}</i>
--------------------------------
<b>Status:</b> ✅ Payment Verified (x402)
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

    return res.status(200).json({ success: true, message: "Priority Mail Delivered!" });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}