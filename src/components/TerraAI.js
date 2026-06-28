import React, { useRef } from 'react';
import ChatBot from 'react-chatbotify';

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
          // Attempt to talk to the secure backend
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: conversationLog.current })
          });
          
          const text = await response.text(); 
          
          // Diagnostic 1: If Vercel routes the API to your HTML file by mistake
          if (text.startsWith('<!DOCTYPE html>')) {
             return `Routing Error: Vercel is blocking the /api route. We need to update vercel.json.`;
          }

          // Diagnostic 2: Standard Server Errors (e.g. 500 Internal Server Error)
          if (!response.ok) {
             return `Server Error ${response.status}: Please ensure your Gemini API Key is saved in Vercel Settings.`;
          }
          
          const data = JSON.parse(text);
          
          // Diagnostic 3: Gemini specifically rejected the request
          if (data.error) {
             return `API Error: ${data.error}`;
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

  // V1 Styling completely forced
  const options = {
    theme: {
      primaryColor: "#d97757", 
      secondaryColor: "#334138",
    },
    header: {
      title: "Terra AI (Live)", // If you don't see this text, your browser is using a cached page!
      showAvatar: false,
    },
    botBubble: {
      showAvatar: false,
    }
  };

  return <ChatBot flow={flow} options={options} />;
};

export default TerraAI;
