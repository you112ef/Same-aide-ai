import React, { useMemo } from 'react';
import { Message } from './ChatMessage';

interface FileExplorerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onFileSelect: (filePath: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ messages, onSendMessage, onFileSelect }) => {
  const lastFileResult = useMemo(() => {
    const fileToolMessages = messages
      .filter(msg => msg.type === 'tool_result' && msg.toolName === 'list_files' && !msg.content.error);
    return fileToolMessages.pop();
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
              <li key={file}>
                <button className="file-button" onClick={() => onFileSelect(file)}>
                  <code>{file}</code>
                </button>
              </li>
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
