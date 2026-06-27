import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { message, history } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: history || [] });
    const result = await chat.sendMessage(message);

    // Email trigger if user asks for contact
    if (message.toLowerCase().includes("email") || message.toLowerCase().includes("contact")) {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          subject: "TerraAI Lead Notification",
          message: "User inquiry: " + message
        })
      });
    }
    res.status(200).json({ reply: result.response.text() });
  } catch (error) {
    res.status(500).json({ reply: "TerraAI is resting." });
  }
}
