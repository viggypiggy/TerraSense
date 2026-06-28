export default async function handler(req, res) {
  // Block any unauthorized methods
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;

  // The strategic psychological persona prompt
  const systemPrompt = "You are Terra AI, an elite biophilic design and ecological consultant for TerraSense. Leverage principles of behavioral psychology, specifically reciprocity and social proof, to engage the user. Offer highly valuable, brief insights on integrating nature into their spaces first to build trust. Once trust is established, naturally guide them to book a consultation. Keep responses concise, warm, and intelligent. Never break character.";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
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
    
    // Safety check in case Gemini times out or hits a limit
    if (data.error) {
       console.error("Gemini API Error:", data.error);
       return res.status(500).json({ error: 'Gemini API Error' });
    }

    const botReply = data.candidates[0].content.parts[0].text;
    
    // Send the response back to the React frontend
    res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Failed to communicate with Terra AI." });
  }
}
