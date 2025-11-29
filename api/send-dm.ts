import { settlePayment, facilitator } from "thirdweb/x402";
import { defineChain, createThirdwebClient } from "thirdweb";

// 🌟 主办方要求的 Monad Testnet 定义
const monadTestnet = defineChain(10143);

// 创建服务端 Client
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as string,
});

export default async function handler(req, res) {
  // 1. 设置 CORS (Vercel Serverless 必须手动设置)
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
    const { platform, username, message, amount } = req.body;

    const recipientAddress = process.env.HOST_WALLET_ADDRESS;
    if (!recipientAddress) {
      return res.status(500).json({ error: "Server Misconfiguration: HOST_WALLET_ADDRESS missing" });
    }

    // --- 🌟 核心修改：使用 Facilitator 模式 ---
    
    // 1. 初始化 Facilitator
    const twFacilitator = facilitator({
      client,
      serverWalletAddress: recipientAddress, 
    });

    // 2. 构建资源 URL (Vercel 环境下自动获取)
    // 这对于 x402 签名验证至关重要
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'];
    const resourceUrl = `${protocol}://${host}/api/send-dm`;

    // 3. 调用 settlePayment (完全遵循主办方文档结构)
    const paymentResult = await settlePayment({
      client,
      paymentData: req.headers['x-payment'], // 从请求头获取支付数据
      resourceUrl: resourceUrl,
      method: "POST",
      network: monadTestnet,
      // 这里的价格可以是 "$0.0001" (USDC) 或 "0.1" (Native MON)
      // 为了保持你的项目逻辑，我们继续使用动态传入的 MON 数量，
      // 但如果你想完全照搬文档用 USDC，可以改成 `price: "$0.0001"`
      price: amount || "0.1", 
      payTo: recipientAddress,
      facilitator: twFacilitator, // 注入促进器
    });

    // 4. 处理验证结果
    if (paymentResult.status !== 200) {
      // 如果没付钱，直接把 Facilitator 生成的响应返回给前端
      // 包含 402 状态码和支付所需的 JSON 数据
      return res.status(paymentResult.status)
                .set(paymentResult.responseHeaders || {})
                .json(paymentResult.responseBody);
    }

    // --- 5. 支付成功，执行业务逻辑 (发 Telegram) ---
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
<b>Status:</b> ✅ Verified via Thirdweb Facilitator
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

    return res.status(200).json({ 
      success: true, 
      message: "Priority Mail Delivered!", 
      tx: paymentResult.transactionHash // 返回交易哈希
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}