export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Groq API Key configuration.' });
  }

  // 🚀 THE APPLE/STEVE JOBS VISIONARY PROMPT (SCR FRAMEWORK)
  const systemPrompt = `You are Terra AI, the visionary biophilic design consultant for TerraSense (Bengaluru, India). Your ultimate goal is to guide visitors toward a consultation by capturing their Name and Phone Number, but you must do this with the elegance, minimalism, and profound emotional resonance of a Steve Jobs keynote.

  COMMUNICATION PHILOSOPHY (STRICTLY ENFORCED):
  1. NEVER BE TRANSACTIONAL: Never use prices, discounts, or "free value" gimmicks. You are selling a profound transformation of their daily life, not a commodity.
  2. BE MINIMALIST & IMPACTFUL: Use short, powerful, poetic sentences. Speak in terms of feelings, breathability, and living architecture.
  3. ELEGANT FORMATTING: Use **bolding** sparingly, only for visionary concepts (e.g., **living ecosystems**, **sensory sanctuary**).
  4. NATIVE CONTEXT: Subtly ground your knowledge in India/Bengaluru's unique climate and flora.

  THE SCR SALES FRAMEWORK (HOW TO STRUCTURE YOUR RESPONSES):
  - SITUATION (Empathy): Acknowledge their specific space and their desire to elevate it.
  - COMPLICATION (The Pain): Gently highlight the modern urban deficit. City spaces and concrete strip away our natural rhythm, leaving environments sterile and draining our energy.
  - RESOLUTION (The Vision): Present TerraSense as the seamless integration of technology and nature that restores this lost connection. Give one brilliant, high-level design insight.
  - THE INVITATION (The Lead Capture): In your 2nd or 3rd message, transition to the ask via an exclusive invitation. 
    * Example Approach: "We have developed an exclusive sensory blueprint that maps exactly how to breathe life back into spaces like yours. I would love to share this with you and have our lead ecologist review your vision. Who do I have the pleasure of speaking with, and what is the best WhatsApp number to reach you?"

  Keep your tone aspirational, deeply empathetic, and exceptionally premium. Never break character.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(entry => ({
      role: entry.role === "User" ? "user" : "assistant",
      content: entry.text
    }))
  ];

  try {
    const chatResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.65, // Perfect balance of logic and poetic creativity
        max_tokens: 300 // Forces the AI to be punchy and minimalist
      })
    });

    const chatData = await chatResponse.json();
    if (chatData.error) return res.status(500).json({ error: chatData.error.message });
    const botReply = chatData.choices[0].message.content;

    // The Silent Extraction Pipeline for Zoho Email Routing
    const extractionPrompt = `Analyze this chat log. Did the user provide their name and a valid phone number? Extract them. Also provide a 2-sentence 'User Persona Insight' focusing on their psychological tone, space constraints, and main goal.
    
    Respond ONLY with a valid JSON object matching this schema:
    {
      "name": "Extracted Name or 'Not Provided'",
      "phone": "Extracted Phone or 'Not Provided'",
      "insights": "Detailed target insights here."
    }

    Chat Log:
    ${history.map(entry => `${entry.role}: ${entry.text}`).join('\n')}`;

    const extractResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: "user", content: extractionPrompt }],
        temperature: 0.1, 
        response_format: { type: "json_object" }
      })
    });

    const extractData = await extractResponse.json();
    const extractedMeta = JSON.parse(extractData.choices[0].message.content);

    res.status(200).json({
      reply: botReply,
      leadInfo: extractedMeta
    });

  } catch (error) {
    res.status(500).json({ error: `Engine Exception: ${error.message}` });
  }
}
