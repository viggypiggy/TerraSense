export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Vercel cannot find the Groq API Key. Please check Environment Variables.' });
  }

  // 1. The Persona
  const systemPrompt = "You are Terra AI, an elite biophilic design and ecological consultant for TerraSense. Leverage principles of behavioral psychology, specifically reciprocity and social proof, to engage the user. Offer highly valuable, brief insights on integrating nature into their spaces first to build trust. Once trust is established, naturally guide them to book a consultation. Keep responses concise, warm, and intelligent. Never break character.";

  // 2. Format history for the Groq/OpenAI Standard
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(entry => ({
      role: entry.role === "User" ? "user" : "assistant",
      content: entry.text
    }))
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // 🚀 THE FIX: Upgraded to Groq's active Llama 3.3 model
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.error) {
       return res.status(500).json({ error: `Groq Error: ${data.error.message}` });
    }

    // 4. Send the response back to the chat bubble
    const botReply = data.choices[0].message.content;
    res.status(200).json({ reply: botReply });

  } catch (error) {
    res.status(500).json({ error: `Backend Crash: ${error.message}` });
  }
}
