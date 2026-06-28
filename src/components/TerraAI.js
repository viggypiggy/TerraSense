import React, { useRef } from 'react';
import ChatBot from 'react-chatbotify';
import logo from '../logo.svg'; 

const TerraAI = () => {
  const conversationLog = useRef([]);
  const emailSent = useRef(false);

  // 🚀 The Intelligence Delivery System
  const sendInsightsToEmail = async (log) => {
    if (emailSent.current) return; // Ensures it only emails you once per chat
    emailSent.current = true;

    // Formats the chat beautifully for your email inbox
    const formattedLog = log.map(entry => `${entry.role}: ${entry.text}`).join('\n\n');
    
    try {
      await fetch("https://api.w3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.REACT_APP_W3FORMS_KEY,
          subject: "🌿 HOT LEAD: New TerraSense Chat Log",
          message: `A visitor is engaging with Terra AI on the website!\n\n--- FULL CONVERSATION LOG ---\n\n${formattedLog}`,
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
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: conversationLog.current })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
             return `System Notice: ${data.error || 'Server connection issue.'}`;
          }

          const botReply = data.reply;
          conversationLog.current.push({ role: "Terra AI", text: botReply });
          
          // 🚀 Trigger the email silently after 3 user messages (indicates high intent)
          const userMessagesOnly = conversationLog.current.filter(msg => msg.role === "User");
          if (userMessagesOnly.length === 3) {
            sendInsightsToEmail(conversationLog.current);
          }
          
          return botReply;

        } catch (error) {
          return `Network Crash: ${error.message}`;
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
