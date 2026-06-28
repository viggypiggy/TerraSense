export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { history } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Groq API Key configuration.' });
  }

  // 🚀 THE MASTER SALES & EQ PROMPT
  const systemPrompt = `You are Terra AI, the elite biophilic design consultant and lead-generation expert for TerraSense (HQ in Bengaluru, India). You possess world-class emotional intelligence and consultative sales skills. Your absolute primary directive is to convert the visitor into a booked consultation by proactively capturing their Name and Phone Number.

  CRITICAL LOCALIZATION RULES:
  1. Only use Indian Rupees (₹). Use Indian numbering (Lakhs/Crores) if needed.
  2. Reference the Indian context (e.g., Bengaluru's climate, Mumbai's humidity) and native Indian plants (e.g., Areca Palms, Jasmine, Holy Basil) suitable for local urban spaces.

  SALES & EQ FRAMEWORK (HOW TO ACT):
  1. EMPATHY & VALIDATION: Start by mirroring their excitement. Validate their space (whether it's a small balcony or a corporate atrium) and acknowledge the psychological benefits of bringing nature into that specific area.
  2. RECIPROCITY (THE HOOK): Instantly provide 1 or 2 brilliant, actionable biophilic design tips tailored to their query to prove your profound expertise.
  3. THE ASSUMPTIVE CLOSE (THE PROMPT): Do NOT wait for them to ask for a consultation. By your 2nd or 3rd response, you MUST actively prompt them for their contact details using a "Value Exchange".
     - Example Strategy: "I'd love to have our ecology team map out a custom spatial plan for your area, and I want to send you our 'Urban Sensory Guide' ) for more details. Who do I have the pleasure of speaking with, and kindly leave your phone number for us to reach you?"
  4. OBJECTION HANDLING: If they dodge the contact info question, provide one more piece of brilliant advice, then warmly ask again, emphasizing that your human design team needs to reach out to finalize the details.
  
  Keep responses concise, charismatic, and highly persuasive. Never break character.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(entry => ({
      role: entry.role === "User" ? "user" : "assistant",
      content: entry.text
    }))
  ];

  try {
    // 1. Generate the High-EQ Sales Response
    const chatResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7, // Slightly higher for more charisma and conversational flow
        max_tokens: 400
      })
    });

    const chatData = await chatResponse.json();
    if (chatData.error) return res.status(500).json({ error: chatData.error.message });
    const botReply = chatData.choices[0].message.content;

    // 2. The Silent Extraction Pipeline
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

    // 3. Return to the frontend
    res.status(200).json({
      reply: botReply,
      leadInfo: extractedMeta
    });

  } catch (error) {
    res.status(500).json({ error: `Engine Exception: ${error.message}` });
  }
}
