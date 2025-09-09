import React, { useState, useEffect } from 'react';

interface LivePreviewProps {
  onSendMessage: (message: string) => void;
  bashStream: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ onSendMessage, bashStream }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Regex to find a URL in the stream. Catches http://localhost:PORT
    const urlRegex = /(http:\/\/(localhost|127\.0\.0\.1):\d+)/;
    const match = bashStream.match(urlRegex);

    if (match && match[0]) {
      // If we find a URL and it's different from the current one, update it.
      if (match[0] !== previewUrl) {
        console.log(`Live preview URL found: ${match[0]}`);
        // Add a timestamp to bust cache and force iframe to reload
        setPreviewUrl(`${match[0]}?t=${Date.now()}`);
      }
    }
  }, [bashStream, previewUrl]);

  const handleStartServer = () => {
    // Command to start the dev server.
    // The `&` is not needed anymore as the tool is now non-blocking.
    const command = 'cd frontend && npm run dev';

    onSendMessage(`\`\`\`bash\n${command}\n\`\`\``);
  };

  return (
    <div className="live-preview">
      <div className="live-preview-header">
        <h3>Live Preview</h3>
        <div className="preview-buttons">
          <button onClick={handleStartServer}>Start Dev Server</button>
          <button onClick={() => onSendMessage('deploy the project')}>Deploy to Production</button>
        </div>
      </div>
      <div className="live-preview-content">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="preview-placeholder">
            <p>Click "Start Server" to see the live application preview.</p>
            <p>Output will appear in the chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;
