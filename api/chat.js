export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;
  const systemPrompt = "You are Terra AI, an elite biophilic design and ecological consultant for TerraSense. Leverage principles of behavioral psychology, specifically reciprocity and social proof, to engage the user. Offer highly valuable, brief insights on integrating nature into their spaces first to build trust. Once trust is established, naturally guide them to book a consultation. Keep responses concise, warm, and intelligent. Never break character.";
  
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Vercel cannot find the Gemini API Key. Please check Environment Variables.' });
  }

  try {
    // THE FIX: Updated the URL to explicitly call 'gemini-1.5-flash-latest'
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: history.map(entry => ({
          role: entry.role === "User" ? "user" : "model",
          parts: [{ text: entry.text }]
        }))
      })
    });

    const data = await response.json();
    
    if (data.error) {
       return res.status(500).json({ error: data.error.message });
    }

    const botReply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply: botReply });

  } catch (error) {
    res.status(500).json({ error: `Backend Crash: ${error.message}` });
  }
}
