import { useState, useEffect } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";
import FileExplorer from "./components/FileExplorer";
import LivePreview from "./components/LivePreview";
import { Message } from "./components/ChatMessage";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [bashStream, setBashStream] = useState<string>("");

  // Effect to establish and manage the WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => console.log("WebSocket connection established");
    ws.onclose = () => console.log("WebSocket connection closed");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'tool_stream' && message.toolName === 'run_bash_command') {
        const { stdout, stderr } = message.stream;
        if (stdout) {
          setBashStream(prev => prev + stdout);
        }
        if (stderr) {
          setBashStream(prev => prev + stderr);
        }
        // Also add the stream chunk to the message history for display
        setMessages(prev => [...prev, {
          sender: "ai",
          type: "tool_stream",
          toolName: "run_bash_command",
          content: null, // The main content is in the stream
          streamContent: { stdout, stderr }
        }]);
      }
    };

    setSocket(ws);
    return () => ws.close();
  }, []);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Clear the bash stream when a new command is sent
    setBashStream("");

    const userMessage: Message = {
      sender: "user",
      type: "chat_message",
      content: messageText,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await response.json();

      let aiResponseMessage: Message;
      if (data.type === 'tool_result') {
        aiResponseMessage = {
          sender: "ai",
          type: "tool_result",
          toolName: data.toolName,
          content: data.result,
        };
      } else {
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
        content: "Sorry, something went wrong.",
      };
      setMessages([...newMessages, errorMessage]);
      console.error(error);
    }
  };

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
        console.error(error);
      }
    };
    fetchInitialMessage();
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar-pane">
        <ChatWindow messages={messages} onSendMessage={sendMessage} />
      </div>
      <div className="main-pane">
        <div className="editor-area">
          <FileExplorer messages={messages} onSendMessage={sendMessage} />
          <div className="editor-placeholder">
            <h2>Code Editor</h2>
            <p><i>A full code editor will be integrated here.</i></p>
          </div>
        </div>
        <div className="preview-area">
          <LivePreview onSendMessage={sendMessage} bashStream={bashStream} />
        </div>
      </div>
    </div>
  );
}

export default App;
