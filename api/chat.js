export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;
  const groqKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;
  // Using the exact key that currently works for your modal!
  const w3formsKey = process.env.REACT_APP_W3FORMS_KEY; 

  if (!groqKey) {
    return res.status(500).json({ error: 'Missing Groq API Key configuration.' });
  }

  // 🚀 THE CLEAR, PROFESSIONAL PROMPT
  const systemPrompt = `You are Terra AI, a professional biophilic design consultant for TerraSense in Bengaluru, India. 
  
  STRICT RULES:
  1. Be clear, concise, and highly professional. Absolutely no poetic, dramatic, or "visionary" language. 
  2. Keep responses to a maximum of 3 short sentences.
  3. Offer straightforward, practical advice on integrating plants into spaces. Use Indian Rupees (₹) if discussing budgets.
  4. Once you provide a helpful tip, politely and directly ask for their Name and Phone Number so our design team can schedule a proper consultation.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(entry => ({
      role: entry.role === "User" ? "user" : "assistant",
      content: entry.text
    }))
  ];

  try {
    // 1. Generate the Professional Chat Response
    const chatResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.3, // Lowered significantly so it stays logical and direct
        max_tokens: 200
      })
    });

    const chatData = await chatResponse.json();
    if (chatData.error) return res.status(500).json({ error: chatData.error.message });
    const botReply = chatData.choices[0].message.content;

    // 2. Extract Lead Info
    const extractionPrompt = `Analyze this chat log. Did the user provide their name and a valid phone number? 
    Respond ONLY with a valid JSON object matching this schema:
    {
      "name": "Extracted Name or 'Not Provided'",
      "phone": "Extracted Phone or 'Not Provided'",
      "insights": "1 sentence summarizing their space and needs."
    }
    
    Chat Log:
    ${history.map(entry => `${entry.role}: ${entry.text}`).join('\n')}\nTerra AI: ${botReply}`;

    const extractResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: "user", content: extractionPrompt }],
        temperature: 0.1, 
        response_format: { type: "json_object" }
      })
    });

    const extractData = await extractResponse.json();
    const extractedMeta = JSON.parse(extractData.choices[0].message.content);

    // 3. SEND THE EMAIL DIRECTLY FROM THE SERVER
    const phoneStr = String(extractedMeta.phone).toLowerCase();
    const isPhoneProvided = phoneStr && phoneStr !== "not provided" && phoneStr !== "null" && phoneStr.length > 5;

    if (isPhoneProvided && w3formsKey) {
      const cleanLog = history.map(entry => `${entry.role}: ${entry.text}`).join('\n\n') + `\n\nTerra AI: ${botReply}`;
      
      await fetch("https://api.w3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: w3formsKey,
          to_email: "vignesh@terrasense.in",
          subject: `🌿 Lead Alert: ${extractedMeta.name !== "Not Provided" ? extractedMeta.name : "New Client"}`,
          message: `👤 Name: ${extractedMeta.name}\n📞 Phone: ${extractedMeta.phone}\n🧠 Insights: ${extractedMeta.insights}\n\n💬 Transcript:\n${cleanLog}`
        }),
      });
    }

    res.status(200).json({ reply: botReply });

  } catch (error) {
    res.status(500).json({ error: `Backend Error: ${error.message}` });
  }
}
