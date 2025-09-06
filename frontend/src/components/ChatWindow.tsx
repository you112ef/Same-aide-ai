import React, { useState, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // Fetch the initial welcome message from the backend
  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await fetch("/api");
        const data = await response.json();
        setMessages([{
          sender: "ai",
          type: "chat_message",
          content: data.message
        }]);
      } catch (error) {
        setMessages([{
          sender: "ai",
          type: "chat_message",
          content: "Failed to connect to the backend."
        }]);
        console.error(error);
      }
    };
    fetchInitialMessage();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // 1. Add the user's message to the chat
      const userMessage: Message = {
        sender: "user",
        type: "chat_message",
        content: input
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");

      try {
        // 2. Send the message to the backend
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();

        // 3. Create a new message for the AI's response based on its type
        let aiResponseMessage: Message;
        if (data.type === 'tool_result') {
          aiResponseMessage = {
            sender: "ai",
            type: "tool_result",
            toolName: data.toolName,
            content: data.result,
          };
        } else { // 'chat_message'
          aiResponseMessage = {
            sender: "ai",
            type: "chat_message",
            content: data.reply,
          };
        }
        setMessages([...newMessages, aiResponseMessage]);

      } catch (error) {
        const errorMessage: Message = {
          sender: "ai",
          type: "chat_message",
          content: "Sorry, something went wrong while getting a response."
        };
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
          placeholder="Try 'ls' or '```bash\nnpm install\n```'"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
