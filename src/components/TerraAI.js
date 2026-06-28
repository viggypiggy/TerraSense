import React, { useRef } from 'react';
import ChatBot from 'react-chatbotify';
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
          if (!response.ok) return `System Alert: ${data.error || 'Server error.'}`;

          // 1. Update the conversation
          const botReply = data.reply;
          conversationLog.current.push({ role: "Terra AI", text: botReply });

          // 2. If the backend found a lead, submit it to Web3Forms from the BROWSER
          if (data.leadData) {
            await fetch("https://api.web3forms.com/submit", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Accept": "application/json" },
              body: JSON.stringify({
                access_key: "94d28d63-f284-4a3b-85f0-1644327ed03a",
                name: data.leadData.name,
                phone: data.leadData.phone,
                subject: `🌿 Lead Alert: ${data.leadData.name}`,
                message: `👤 Name: ${data.leadData.name}\n📞 Phone: ${data.leadData.phone}\n🧠 Insights: ${data.leadData.insights}`
              }),
            });
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
