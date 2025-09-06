import { useState, useEffect, useCallback } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";
import FileExplorer from "./components/FileExplorer";
import LivePreview from "./components/LivePreview";
import CodeEditor from "./components/CodeEditor";
import { Message } from "./components/ChatMessage";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [bashStream, setBashStream] = useState<string>("");
  const [activeFile, setActiveFile] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("// Select a file to start editing");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    ws.onopen = () => console.log("WebSocket established");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'tool_stream') {
        const { stdout, stderr } = message.stream;
        if (stdout) setBashStream(prev => prev + stdout);
        if (stderr) setBashStream(prev => prev + stderr);
        setMessages(prev => [...prev, { sender: "ai", type: "tool_stream", content: null, ...message }]);
      }
    };
    setSocket(ws);
    return () => ws.close();
  }, []);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;
    setBashStream("");
    const userMessage: Message = { sender: "user", type: "chat_message", content: messageText };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await response.json();
      const aiResponseMessage: Message = { sender: "ai", ...data };
      setMessages(prev => [...prev, aiResponseMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: "ai", type: "chat_message", content: "Sorry, an error occurred." };
      setMessages(prev => [...prev, errorMessage]);
      console.error(error);
    }
  }, []);

  // Effect to load file content into editor when a 'read_file' tool result arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'tool_result' && lastMessage.toolName === 'read_file' && !lastMessage.content.error) {
      setEditorContent(lastMessage.content.content);
    }
  }, [messages]);

  const handleFileSelect = (filePath: string) => {
    if (filePath.endsWith('/')) return; // It's a directory
    setActiveFile(filePath);
    sendMessage(`read \`${filePath}\``);
  };

  const handleSaveFile = () => {
    if (!activeFile) return;
    const command = `edit \`${activeFile}\` with content:\n\`\`\`\n${editorContent}\n\`\`\``;
    sendMessage(command);
  };

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await fetch("/api");
        const data = await response.json();
        setMessages([{ sender: "ai", type: "chat_message", content: data.message }]);
      } catch (error) { console.error(error); }
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
          <FileExplorer messages={messages} onSendMessage={sendMessage} onFileSelect={handleFileSelect} />
          <CodeEditor
            filePath={activeFile}
            fileContent={editorContent}
            onContentChange={setEditorContent}
            onSave={handleSaveFile}
          />
        </div>
        <div className="preview-area">
          <LivePreview onSendMessage={sendMessage} bashStream={bashStream} />
        </div>
      </div>
    </div>
  );
}

export default App;
