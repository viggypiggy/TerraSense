import React from 'react';
import ChatBot from 'react-chatbotify';

const TerraAI = () => {
  const handleLogic = async (params) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: params.userInput, history: [] })
    });
    const data = await res.json();
    params.injectMessage(data.reply);
  };

  return (
    <ChatBot 
      settings={{ general: { primaryColor: "#2C4C3B" }, header: { title: "TerraAI" } }}
      flow={{
        start: { message: "Hello! I am TerraAI. How can I improve your space today?", chatDisabled: false },
        loop: { message: (params) => handleLogic(params) }
      }}
    />
  );
};
export default TerraAI;
