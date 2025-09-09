import React from "react";

export interface Message {
  sender: "user" | "ai";
  type: "chat_message" | "tool_result" | "tool_stream";
  content: any;
  toolName?: string;
  streamContent?: { stdout?: string; stderr?: string };
}

interface ChatMessageProps {
  message: Message;
}

const ToolResultMessage: React.FC<{ toolName: string; result: any }> = ({ toolName, result }) => {
  switch (toolName) {
    case "list_files":
    case "list_snapshots":
      if (result.error) return <div className="error-message">Error: {result.error}</div>;
      const items = result.files || result.snapshots || [];
      const title = toolName === 'list_files' ? 'Files in repository:' : 'Snapshots:';
      return (
        <div className="tool-content">
          <p>{title}</p>
          <ul>{items.map((item: any, index: number) => <li key={index}><code>{item.hash ? `${item.hash} - ${item.message}` : item}</code></li>)}</ul>
        </div>
      );

    case "read_file":
      if (result.error) return <div className="error-message">Error: {result.error}</div>;
      return <div className="tool-content"><p>File content:</p><pre><code>{result.content}</code></pre></div>;

    case "edit_file":
    case "save_snapshot":
    case "startup":
    case "deploy":
      if (result.error) return <div className="error-message">Error: {result.error}</div>;
      return (
        <div className="tool-content">
          <p>{result.message}</p>
          {result.deploymentUrl && (
            <p>URL: <a href={result.deploymentUrl} target="_blank" rel="noopener noreferrer">{result.deploymentUrl}</a></p>
          )}
        </div>
      );

    case "run_bash_command":
      const { stdout, stderr } = result;
      return (
        <div className="tool-content bash-output">
          {stdout && (<div><p><strong>Output (stdout):</strong></p><pre><code>{stdout}</code></pre></div>)}
          {stderr && (<div><p><strong>Error (stderr):</strong></p><pre><code className="error-message">{stderr}</code></pre></div>)}
          {!stdout && !stderr && <p>Command executed with no output.</p>}
        </div>
      );

    default:
      return <div className="tool-content"><pre>{JSON.stringify(result, null, 2)}</pre></div>;
  }
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const messageClass = message.sender === "user" ? "user-message" : "ai-message";

  const renderContent = () => {
    switch (message.type) {
      case "chat_message":
        return <p>{message.content}</p>;
      case "tool_result":
        return (
          <div className="tool-result">
            <p className="tool-title"><strong>Tool Executed:</strong> <code>{message.toolName}</code></p>
            <ToolResultMessage toolName={message.toolName!} result={message.content} />
          </div>
        );
      case "tool_stream":
        const { stdout, stderr } = message.streamContent || {};
        return (
          <pre className="tool-stream">
            {stdout && <span className="stdout">{stdout}</span>}
            {stderr && <span className="stderr error-message">{stderr}</span>}
          </pre>
        );
      default:
        return null;
    }
  };

  return <div className={`chat-message ${messageClass}`}>{renderContent()}</div>;
};

export default ChatMessage;
