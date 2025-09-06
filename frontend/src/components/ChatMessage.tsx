import React from "react";

interface ChatMessageProps {
  message: {
    sender: "user" | "ai";
    text: string;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const messageClass = message.sender === "user" ? "user-message" : "ai-message";

  return (
    <div className={`chat-message ${messageClass}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default ChatMessage;
