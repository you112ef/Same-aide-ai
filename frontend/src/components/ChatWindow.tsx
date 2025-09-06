import React, { useState } from "react";
import ChatMessage, { Message } from "./ChatMessage";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="chat-window">
      <h3>Conversation</h3>
      <div className="message-list">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </div>
      <form onSubmit={handleFormSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 'search for react best practices'"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
