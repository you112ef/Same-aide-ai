import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await fetch("http://localhost:3000/api");
        const data = await response.json();
        setMessages([{ sender: "ai", text: data.message }]);
      } catch (error) {
        setMessages([{ sender: "ai", text: "Failed to connect to the backend." }]);
        console.error(error);
      }
    };
    fetchInitialMessage();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newUserMessage: Message = { sender: "user", text: input };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setInput("");
      // TODO: Send the message to the AI backend and get a response
    }
  };

  return (
    <div className="chat-window">
      <div className="message-list">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
