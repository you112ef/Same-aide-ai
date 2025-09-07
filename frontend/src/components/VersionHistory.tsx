import React, { useMemo } from 'react';
import { Message } from './ChatMessage';

interface VersionHistoryProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ messages, onSendMessage }) => {
  const lastSnapshotResult = useMemo(() => {
    const snapshotToolMessages = messages
      .filter(msg => msg.type === 'tool_result' && msg.toolName === 'list_snapshots' && !msg.content.error);
    return snapshotToolMessages.pop();
  }, [messages]);

  const handleRefresh = () => {
    onSendMessage('list snapshots');
  };

  return (
    <div className="version-history">
      <div className="version-history-header">
        <h3>Version History</h3>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
      <div className="version-history-content">
        {lastSnapshotResult ? (
          <ul>
            {lastSnapshotResult.content.snapshots.map((snapshot: any) => (
              <li key={snapshot.hash}>
                <code>{snapshot.hash}</code> - <span>{snapshot.message}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p><i>Click "Refresh" or ask the AI to see project history.</i></p>
        )}
      </div>
    </div>
  );
};

export default VersionHistory;
