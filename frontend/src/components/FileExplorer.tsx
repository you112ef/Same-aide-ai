import React, { useMemo } from 'react';
import { Message } from './ChatMessage';

interface FileExplorerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ messages, onSendMessage }) => {
  // Find the most recent successful 'list_files' tool result in the messages
  const lastFileResult = useMemo(() => {
    const fileToolMessages = messages
      .filter(msg => msg.type === 'tool_result' && msg.toolName === 'list_files' && !msg.content.error);
    return fileToolMessages.pop(); // Get the last one
  }, [messages]);

  const handleRefresh = () => {
    onSendMessage('ls');
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>File Explorer</h3>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
      <div className="file-explorer-content">
        {lastFileResult ? (
          <ul>
            {lastFileResult.content.files.map((file: string) => (
              <li key={file}><code>{file}</code></li>
            ))}
          </ul>
        ) : (
          <p><i>Click "Refresh" or type "ls" in the chat to see files.</i></p>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
