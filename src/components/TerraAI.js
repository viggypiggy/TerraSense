import React, { useRef } from 'react';
import ChatBot from 'react-chatbotify';
import logo from '../logo.svg'; 

const TerraAI = () => {
  const conversationLog = useRef([]);
  // Track status to prevent duplicate loops
  const hasSentEmail = useRef(false);
  const lastSentPhone = useRef(null);
  const lastSentInsights = useRef(null); // Track the project details

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

          // Check if we have valid lead data to evaluate
          if (data.leadData) {
            const currentPhone = data.leadData.phone;
            const currentInsights = data.leadData.insights;

            // Logic: Is this a brand new lead, or an update to an existing one?
            const isNewLead = !hasSentEmail.current && currentPhone !== "Not Provided";
            const isUpdatedLead = hasSentEmail.current && (
                (currentPhone !== lastSentPhone.current && currentPhone !== "Not Provided") || 
                (currentInsights !== lastSentInsights.current)
            );

            if (isNewLead || isUpdatedLead) {
              hasSentEmail.current = true;
              lastSentPhone.current = currentPhone;
              lastSentInsights.current = currentInsights;

              const transcript = conversationLog.current
                .map(entry => `${entry.role}: ${entry.text}`)
                .join('\n');

              const subjectLine = isUpdatedLead 
                ? `🌿 UPDATE: Lead Alert for ${data.leadData.name}` 
                : `🌿 New Lead Alert: ${data.leadData.name}`;

              await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                  access_key: "94d28d63-f284-4a3b-85f0-1644327ed03a",
                  name: data.leadData.name,
                  phone: currentPhone,
                  subject: subjectLine,
                  message: `👤 Name: ${data.leadData.name}\n📞 Phone: ${currentPhone}\n🧠 Insights: ${currentInsights}\n\n💬 Full Conversation:\n${transcript}`
                }),
              });
            }
          }

          return botReply;

        } catch (error) {
          return `Connection drop: ${error.message}`;
        }
      },
      path: "process_chat"
    }
  };

  // ... (options object remains the same)
  const options = {
    theme: { primaryColor: "#d97757", secondaryColor: "#334138", showFooter: false },
    header: { title: "Terra AI", showAvatar: true, avatar: logo, buttons: ["CLOSE_CHAT_BUTTON"] },
    botBubble: { showAvatar: true, avatar: logo },
    chatButton: { icon: logo },
    tooltip: { mode: "CLOSE" }
  };

  return <ChatBot flow={flow} options={options} />;
};

export default TerraAI;
