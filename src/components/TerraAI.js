import React, { useRef } from 'react';
import ChatBot from 'react-chatbotify';
import logo from '../logo.svg'; 

const TerraAI = () => {
  const conversationLog = useRef([]);
  const hasEmailed = useRef(false);

  const dispatchLeadEmail = async (meta, fullLog) => {
    // Only dispatch if contact info exists and we haven't already fired an alert
    if (meta.name === "Not Provided" && meta.phone === "Not Provided") return;
    if (hasEmailed.current) return;
    hasEmailed.current = true;

    const cleanLog = fullLog.map(entry => `${entry.role}: ${entry.text}`).join('\n\n');

    try {
      await fetch("https://api.w3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.REACT_APP_W3FORMS_KEY,
          to_email: "vignesh@terrasense.in", // Direct Zoho routing
          subject: `🌿 Lead Alert: ${meta.name} interested in TerraSense`,
          message: `
✨ NEW CLIENT INTELLIGENCE PROFILE DETECTED

👤 Customer Details:
-----------------------------------------
Name: ${meta.name}
Phone Number: ${meta.phone}

🧠 AI Persona Insights & Spatial Goals:
-----------------------------------------
${meta.insights}

💬 Raw Interaction Transcript:
-----------------------------------------
${cleanLog}
          `,
        }),
      });
    } catch (err) {
      console.error("W3Forms delivery failure:", err);
    }
  };

  const flow = {
    start: {
      message: "Hello! I am Terra AI. How can I improve your space today?",
      path: "process_chat"
    },
    process_chat: {
      message: async (params) => {
        const userText = params.userInput;
        conversationLog.current.push({ role: "User", text: userText });

        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: conversationLog.current })
          });
          
          const data = await response.json();
          if (!response.ok) return `System Alert: ${data.error || 'Server error.'}`;

          const botReply = data.reply;
          conversationLog.current.push({ role: "Terra AI", text: botReply });

          // Evaluate lead parameters to check if contact information was captured
          if (data.leadInfo) {
            dispatchLeadEmail(data.leadInfo, conversationLog.current);
          }

          return botReply;

        } catch (error) {
          return `Connection drop: ${error.message}`;
        }
      },
      path: "process_chat"
    }
  };

  const options = {
    theme: {
      primaryColor: "#d97757", 
      secondaryColor: "#334138",
      showFooter: false, 
    },
    header: {
      title: "Terra AI", 
      showAvatar: true,
      avatar: logo, 
      buttons: ["CLOSE_CHAT_BUTTON"], 
    },
    botBubble: {
      showAvatar: true,
      avatar: logo, 
    },
    chatButton: {
      icon: logo, 
    },
    tooltip: {
      mode: "CLOSE",
    }
  };

  return <ChatBot flow={flow} options={options} />;
};

export default TerraAI;
