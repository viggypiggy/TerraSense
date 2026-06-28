export default async function handler(req, res) {
  // 1. HTTP Method Guard (Security Standard)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;
  
  // 2. Environment Variable Fallback Chain (Resilience)
  // This ensures that even if there is a slight typo in your Vercel dashboard keys, the backend still finds it.
  const groqKey = process.env.GROQ_API_KEY || process.env.GROQ__KEY; 
  const w3formsKey = process.env.REACT_APP_M3FORMS_KEY || process.env.REACT_APP_W3FORMS_KEY || process.env.WEB3F__KEY;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Invalid chat history format.' });
  }

  if (!groqKey) {
    console.error('CRITICAL: Missing Groq API Key in environment variables.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // 3. AI Persona & Prompt Engineering (The Consultative Closer)
  const systemPrompt = `You are Terra AI, the lead client advisor for TerraSense in Bengaluru. You are a highly professional, empathetic, and effective consultative salesperson.

  STRICT RULES:
  1. NEVER mention pricing, budgets, rupees, or money. Focus entirely on the client's vision and the value of biophilic design.
  2. Keep responses extremely concise (maximum 2 to 3 sentences). Be clear, warm, and direct.
  3. Do not repeat yourself or sound robotic. Acknowledge the user's specific answers naturally.
  4. First, politely ask what specific kind of space they are looking to transform (e.g., office, balcony, living room). 
  5. Once they tell you about their space, give them ONE brief, expert insight on how natural elements will elevate that specific area.
  6. Immediately after providing that insight, smoothly ask for their Name and Phone Number so a senior designer can reach out with a personalized plan.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(entry => ({
      role: entry.role === "User" ? "user" : "assistant",
      content: entry.text
    }))
  ];

  try {
    // 4. Generate the AI Response
    const chatResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.3, // Low variance keeps the salesperson focused and professional
        max_tokens: 250
      })
    });

    if (!chatResponse.ok) {
      throw new Error(`Groq API Error: ${chatResponse.statusText}`);
    }

    const chatData = await chatResponse.json();
    const botReply = chatData.choices[0].message.content;

    // 5. Intelligent Lead Extraction (Silent Analysis)
    const extractionPrompt = `Analyze this chat log. Did the user provide their name and a valid phone number (at least 6 digits)? 
    Respond ONLY with a valid JSON object matching this schema:
    {
      "name": "Extracted Name or 'Not Provided'",
      "phone": "Extracted Phone or 'Not Provided'",
      "insights": "1 brief sentence summarizing their space and needs."
    }
    
    Chat Log:\n${history.map(entry => `${entry.role}: ${entry.text}`).join('\n')}\nTerra AI: ${botReply}`;

    const extractResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: "user", content: extractionPrompt }],
        temperature: 0.1, // Near-zero for strict, deterministic JSON parsing
        response_format: { type: "json_object" }
      })
    });

    const extractData = await extractResponse.json();
    const extractedMeta = JSON.parse(extractData.choices[0].message.content);

    // 6. Lead Routing Logic (The Trigger)
    const phoneStr = String(extractedMeta.phone).toLowerCase().trim();
    const isPhoneProvided = phoneStr !== "not provided" && phoneStr !== "null" && phoneStr.length > 5;

    // 7. Data Dispatch via W3Forms
    if (isPhoneProvided && w3formsKey) {
      const cleanLog = history.map(entry => `${entry.role}: ${entry.text}`).join('\n\n') + `\n\nTerra AI: ${botReply}`;
      
      const w3Payload = {
        access_key: w3formsKey,
        name: extractedMeta.name !== "Not Provided" ? extractedMeta.name : "New TerraSense Lead",
        email: "leads@terrasense.in", // The required fallback to bypass the 400 error
        to_email: "vignesh@terrasense.in",
        subject: `🌿 Lead Alert: ${extractedMeta.name !== "Not Provided" ? extractedMeta.name : "New Client"}`,
        message: `👤 Name: ${extractedMeta.name}\n📞 Phone: ${extractedMeta.phone}\n🧠 Insights: ${extractedMeta.insights}\n\n💬 Transcript:\n${cleanLog}`
      };

      const w3Res = await fetch("https://api.w3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(w3Payload),
      });

      // Silent error logging to Vercel so the user experience isn't interrupted
      if (!w3Res.ok) console.error('W3Forms rejection:', await w3Res.text());
    }

    // 8. Deliver final message to frontend
    return res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error('Backend Architecture Error:', error);
    return res.status(500).json({ error: 'System processing error.' });
  }
}
