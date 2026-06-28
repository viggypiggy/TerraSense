export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Vercel cannot find the Gemini API Key. Please check Environment Variables.' });
  }

  try {
    // ---------------------------------------------------------
    // STEP 1: DYNAMICALLY ASK GOOGLE WHAT MODELS YOU CAN USE
    // ---------------------------------------------------------
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const listData = await listResponse.json();

    if (listData.error) {
      return res.status(500).json({ error: `Key Authorization Failed: ${listData.error.message}` });
    }

    // Filter the list to only include models that can actually generate text (chat)
    const availableModels = listData.models || [];
    const chatModels = availableModels.filter(m => 
      m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")
    );

    if (chatModels.length === 0) {
      return res.status(500).json({ error: 'Your Google API key is valid, but it has zero text-generation models enabled for it.' });
    }

    // ---------------------------------------------------------
    // STEP 2: AUTOMATICALLY SELECT THE BEST AVAILABLE MODEL
    // ---------------------------------------------------------
    // We prioritize 1.5 Flash, then 1.5 Pro, then fallback to whatever Google gives us.
    let selectedModel = 
      chatModels.find(m => m.name.includes("gemini-1.5-flash"))?.name ||
      chatModels.find(m => m.name.includes("gemini-1.5-pro"))?.name ||
      chatModels.find(m => m.name.includes("gemini-pro"))?.name ||
      chatModels[0].name; // The ultimate fallback

    // Clean up the name string for the URL
    const modelString = selectedModel.replace('models/', '');

    // ---------------------------------------------------------
    // STEP 3: INJECT PERSONA & SEND TO THE SELECTED MODEL
    // ---------------------------------------------------------
    const systemPrompt = "You are Terra AI, an elite biophilic design and ecological consultant for TerraSense. Leverage principles of behavioral psychology, specifically reciprocity and social proof, to engage the user. Offer highly valuable, brief insights on integrating nature into their spaces first to build trust. Once trust is established, naturally guide them to book a consultation. Keep responses concise, warm, and intelligent. Never break character.";
    
    const formattedHistory = history.map((entry, index) => {
      let text = entry.text;
      // Injecting the persona into the very first message prevents version-conflict errors
      if (index === 0 && entry.role === "User") {
        text = `[SYSTEM PERSONA INSTRUCTIONS: ${systemPrompt}]\n\nUser says: ${text}`;
      }
      return {
        role: entry.role === "User" ? "user" : "model",
        parts: [{ text: text }]
      };
    });

    const chatResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelString}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory })
    });

    const chatData = await chatResponse.json();
    
    if (chatData.error) {
       return res.status(500).json({ error: `Generate Error on ${modelString}: ${chatData.error.message}` });
    }

    const botReply = chatData.candidates[0].content.parts[0].text;
    res.status(200).json({ reply: botReply });

  } catch (error) {
    res.status(500).json({ error: `Fatal Backend Crash: ${error.message}` });
  }
}
