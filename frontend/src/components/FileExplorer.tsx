import React, { useState, useEffect } from 'react';
import { Message } from './ChatMessage';
import FileTreeNode, { TreeNode } from './FileTreeNode';

interface FileExplorerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onFileSelect: (filePath: string) => void;
}

// Helper to recursively insert nodes into the tree. This is a more robust way to handle state.
const insertIntoTree = (tree: { [key: string]: TreeNode }, path: string, files: string[]): { [key: string]: TreeNode } => {
  const newTree = JSON.parse(JSON.stringify(tree)); // Simple deep copy
  const pathParts = path.split('/').filter(p => p);

  let currentLevel = newTree;
  for (const part of pathParts) {
    if (currentLevel[part + '/']) {
      currentLevel = currentLevel[part + '/'].children!;
    } else {
      // If a path segment doesn't exist, we can't insert.
      // This indicates an out-of-order message, which we'll ignore for now.
      return newTree;
    }
  }

  // Clear existing children and add the new ones
  Object.keys(currentLevel).forEach(key => delete currentLevel[key]);
  files.forEach((file: string) => {
    const isDirectory = file.endsWith('/');
    currentLevel[file] = {
      type: isDirectory ? 'directory' : 'file',
      ...(isDirectory && { children: {} }),
    };
  });

  return newTree;
};


const FileExplorer: React.FC<FileExplorerProps> = ({ messages, onSendMessage, onFileSelect }) => {
  const [fileTree, setFileTree] = useState<{ [key: string]: TreeNode }>({});
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // This effect processes new 'list_files' results and updates the tree
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'tool_result' && lastMessage.toolName === 'list_files' && !lastMessage.content.error) {
      const { files, args } = lastMessage.content;
      const dirPath = args?.path || '.';

      if (dirPath === '.') {
        // If it's the root, we can just replace the whole tree
        const newRoot: { [key: string]: TreeNode } = {};
        files.forEach((file: string) => {
          const isDirectory = file.endsWith('/');
          newRoot[file] = {
            type: isDirectory ? 'directory' : 'file',
            ...(isDirectory && { children: {} }),
          };
        });
        setFileTree(newRoot);
      } else {
        // If it's a subdirectory, we need to insert it into the existing tree
        setFileTree(prevTree => insertIntoTree(prevTree, dirPath, files));
      }
    }
  }, [messages]);

  const handleDirectoryToggle = (dirPath: string) => {
    const newExpandedDirs = new Set(expandedDirs);
    if (newExpandedDirs.has(dirPath)) {
      newExpandedDirs.delete(dirPath); // Collapse
    } else {
      newExpandedDirs.add(dirPath); // Expand
      // Fetch the content for the newly expanded directory
      onSendMessage(`list files in \`${dirPath}\``);
    }
    setExpandedDirs(newExpandedDirs);
  };

  // Initial load of the root directory
  useEffect(() => {
    onSendMessage('list files');
  }, []);

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>File Explorer</h3>
        <button onClick={() => onSendMessage('list files')}>Refresh Root</button>
      </div>
      <div className="file-explorer-content">
        {Object.entries(fileTree).length > 0 ? (
          Object.entries(fileTree).map(([name, node]) => (
            <FileTreeNode
              key={name}
              name={name}
              node={node}
              onFileSelect={onFileSelect}
              onDirectoryToggle={handleDirectoryToggle}
              path={name}
              isExpanded={expandedDirs.has(name)}
            />
          ))
        ) : (
          <p><i>Loading file tree...</i></p>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
