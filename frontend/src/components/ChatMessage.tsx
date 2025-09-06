import React from "react";

// Define a more detailed structure for our messages
export interface Message {
  sender: "user" | "ai";
  type: "chat_message" | "tool_result";
  content: any; // Can be a string for chat or an object for tool results
  toolName?: string;
}

interface ChatMessageProps {
  message: Message;
}

// A specific component to render tool results for better readability
const ToolResultMessage: React.FC<{ toolName: string; result: any }> = ({ toolName, result }) => {
  // Render based on the tool that was called
  switch (toolName) {
    case "list_files":
      if (result.error) {
        return <div className="error-message">Error: {result.error}</div>;
      }
      return (
        <div className="tool-content">
          <p>Files in repository:</p>
          <ul>
            {result.files.map((file: string) => <li key={file}><code>{file}</code></li>)}
          </ul>
        </div>
      );

    case "read_file":
      if (result.error) {
        return <div className="error-message">Error: {result.error}</div>;
      }
      return (
        <div className="tool-content">
          <p>File content:</p>
          <pre><code>{result.content}</code></pre>
        </div>
      );

    case "edit_file":
      if (result.error) {
        return <div className="error-message">Error: {result.error}</div>;
      }
      return (
        <div className="tool-content">
          <p>{result.message}</p>
        </div>
      );

    case "run_bash_command":
      const { stdout, stderr } = result;
      return (
        <div className="tool-content bash-output">
          {stdout && (
            <div>
              <p><strong>Output (stdout):</strong></p>
              <pre><code>{stdout}</code></pre>
            </div>
          )}
          {stderr && (
            <div>
              <p><strong>Error (stderr):</strong></p>
              <pre><code className="error-message">{stderr}</code></pre>
            </div>
          )}
          {!stdout && !stderr && (
            <p>Command executed with no output.</p>
          )}
        </div>
      );

    default:
      // Fallback for any other tools that might be added
      return (
        <div className="tool-content">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      );
  }
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const messageClass = message.sender === "user" ? "user-message" : "ai-message";

  return (
    <div className={`chat-message ${messageClass}`}>
      {message.type === "chat_message" ? (
        <p>{message.content}</p>
      ) : (
        <div className="tool-result">
          <p className="tool-title">
            <strong>Tool Executed:</strong> <code>{message.toolName}</code>
          </p>
          <ToolResultMessage toolName={message.toolName!} result={message.content} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
