export default async function handler(req, res) {
  // 1. Guard against non-POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;
  
  // 2. Keys
  // GROQ is a true secret key, so it must stay in Vercel's environment variables.
  const groqKey = process.env.GROQ_API_KEY; 
  
  // Web3Forms Access Keys are PUBLIC form IDs. Hardcoded to bypass Vercel env bugs.
  const w3formsKey = "94d28d63-f284-4a3b-85f0-1644327ed03a";

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Invalid chat history format.' });
  }

  if (!groqKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing Groq Key.' });
  }

  // 3. AI Persona
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
    // 4. Generate Main AI Response
    const chatResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.3,
        max_tokens: 250
      })
    });

    if (!chatResponse.ok) throw new Error(`Groq Error: ${chatResponse.statusText}`);
    const chatData = await chatResponse.json();
    const botReply = chatData.choices[0].message.content;

    // 5. Intelligent Lead Extraction (Only runs if digits are present)
    const fullChatText = history.map(e => e.text).join(' ') + ' ' + botReply;
    const containsDigits = /\d{5,}/.test(fullChatText);

    if (containsDigits) {
      try {
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
            temperature: 0.1,
            response_format: { type: "json_object" }
          })
        });

        if (extractResponse.ok) {
          const extractData = await extractResponse.json();
          const extractedMeta = JSON.parse(extractData.choices[0].message.content);

          const phoneStr = String(extractedMeta.phone).toLowerCase().trim();
          const isPhoneProvided = phoneStr !== "not provided" && phoneStr !== "null" && phoneStr.length > 5;

          // 6. Send to Web3Forms
          if (isPhoneProvided) {
            const cleanLog = history.map(entry => `${entry.role}: ${entry.text}`).join('\n\n') + `\n\nTerra AI: ${botReply}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const w3Res = await fetch("https://api.web3forms.com/submit", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json", 
                "Accept": "application/json",
                // THIS IS THE FIX: The User-Agent bypasses Cloudflare's bot blocker
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
              },
              signal: controller.signal,
              body: JSON.stringify({
                access_key: w3formsKey,
                name: extractedMeta.name !== "Not Provided" ? extractedMeta.name : "New TerraSense Lead",
                email: "leads@terrasense.in",
                to_email: "vignesh@terrasense.in",
                subject: `🌿 Lead Alert: ${extractedMeta.name !== "Not Provided" ? extractedMeta.name : "New Client"}`,
                message: `👤 Name: ${extractedMeta.name}\n📞 Phone: ${extractedMeta.phone}\n🧠 Insights: ${extractedMeta.insights}\n\n💬 Transcript:\n${cleanLog}`
              }),
            });
            
            clearTimeout(timeoutId);
            if (!w3Res.ok) console.error('Web3Forms rejected payload:', await w3Res.text());
          }
        }
      } catch (innerError) {
        console.error("Non-blocking lead processing error:", innerError);
      }
    }

    // 7. Deliver message to frontend
    return res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error('Critical Architecture Error:', error);
    return res.status(500).json({ error: 'System processing error.' });
  }
}
