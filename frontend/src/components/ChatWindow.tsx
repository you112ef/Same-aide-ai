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
        const response = await fetch("/api");
        const data = await response.json();
        setMessages([{ sender: "ai", text: data.message }]);
      } catch (error) {
        setMessages([{ sender: "ai", text: "Failed to connect to the backend." }]);
        console.error(error);
      }
    };
    fetchInitialMessage();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newUserMessage: Message = { sender: "user", text: input };
      const newMessages = [...messages, newUserMessage];
      setMessages(newMessages);
      setInput("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        const aiMessage: Message = { sender: "ai", text: data.reply };
        setMessages([...newMessages, aiMessage]);
      } catch (error) {
        const errorMessage: Message = { sender: "ai", text: "Failed to get a response from the AI." };
        setMessages([...newMessages, errorMessage]);
        console.error(error);
      }
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
