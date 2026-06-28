import React, { useRef } from 'react';
import ChatBot from 'react-chatbotify';
// This assumes TerraAI.js is in your components folder and logo.svg is in the src folder.
import logo from '../logo.svg'; 

const TerraAI = () => {
  const conversationLog = useRef([]);

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
          
          // Now it will print the EXACT error from the backend instead of a generic 500
          if (!response.ok) {
             return `API Error: ${data.error || 'Unknown Server Crash'}`;
          }

          const botReply = data.reply;
          conversationLog.current.push({ role: "Terra AI", text: botReply });
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
      showFooter: false, // 🚀 COMPLETELY removes the "Powered by React Chatbotify" branding
    },
    header: {
      title: "Terra AI", 
      showAvatar: true,
      avatar: logo, // 🚀 Uses your TerraSense logo
    },
    botBubble: {
      showAvatar: true,
      avatar: logo, // 🚀 Uses your TerraSense logo for bot messages
    }
  };

  return <ChatBot flow={flow} options={options} />;
};

export default TerraAI;
