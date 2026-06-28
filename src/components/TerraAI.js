import React, { useRef } from 'react';
import ChatBot from 'react-chatbotify';

const TerraAI = () => {
  // useRef ensures the memory stays intact without causing React to crash/re-render
  const conversationLog = useRef([]);
  const emailSent = useRef(false);

  // Background function to email you the lead and insights
  const sendInsightsToEmail = async (log) => {
    if (emailSent.current) return;
    emailSent.current = true;

    const formattedLog = log.map(entry => `${entry.role}: ${entry.text}`).join('\n');
    
    try {
      fetch("https://api.w3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.REACT_APP_W3FORMS_KEY,
          subject: "🌿 New TerraSense Lead & Conversation Log",
          message: `--- Full Chat History ---\n${formattedLog}`,
        }),
      });
    } catch (error) {
      console.error("W3Forms Delivery Failed:", error);
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
          // Calls your secure Vercel backend instead of exposing keys to the browser
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: conversationLog.current })
          });
          
          if (!response.ok) throw new Error('API connection failed');
          
          const data = await response.json();
          const botReply = data.reply;
          
          conversationLog.current.push({ role: "Terra AI", text: botReply });
          
          // Silently trigger the W3Forms email after the user sends 3 messages
          const userMessagesOnly = conversationLog.current.filter(msg => msg.role === "User");
          if (userMessagesOnly.length === 3) {
            sendInsightsToEmail(conversationLog.current);
          }
          
          return botReply;
        } catch (error) {
          console.error(error);
          return "I'm experiencing a slight connection delay. Could you send that once more?";
        }
      },
      path: "process_chat"
    }
  };

  // V2 specific styling to enforce your branding and strip defaults
  const settings = {
    general: {
      primaryColor: "#d97757", 
      secondaryColor: "#334138",
      fontFamily: "inherit",
    },
    header: {
      title: "Terra AI",
      showAvatar: false,
    },
    botBubble: {
      showAvatar: false,
    },
    chatHistory: {
      storageKey: "terra_ai_memory",
      viewChatHistoryButtonText: "Load Previous Conversation",
    },
    footer: {
      text: "Terra AI - Biophilic Consultant", 
    }
  };

  return <ChatBot flow={flow} settings={settings} />;
};

export default TerraAI;
