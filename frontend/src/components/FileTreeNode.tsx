import React from 'react';

// Define the structure for a node in our file tree
export interface TreeNode {
  type: 'file' | 'directory';
  children?: { [key: string]: TreeNode };
}

interface FileTreeNodeProps {
  name: string;
  node: TreeNode;
  onFileSelect: (path: string) => void;
  onDirectoryToggle: (path: string) => void;
  path: string;
  isExpanded: boolean;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ name, node, onFileSelect, onDirectoryToggle, path, isExpanded }) => {
  const isDirectory = node.type === 'directory';

  const handleToggle = () => {
    if (isDirectory) {
      onDirectoryToggle(path);
    } else {
      onFileSelect(path);
    }
  };

  return (
    <div className="file-tree-node">
      <button onClick={handleToggle} className="node-button">
        {isDirectory ? (isExpanded ? '▼' : '►') : '📄'} <code>{name}</code>
      </button>
      {isDirectory && isExpanded && node.children && (
        <div className="node-children">
          {Object.entries(node.children).map(([childName, childNode]) => (
            <FileTreeNode
              key={childName}
              name={childName}
              node={childNode}
              onFileSelect={onFileSelect}
              onDirectoryToggle={onDirectoryToggle}
              path={`${path}/${childName}`}
              isExpanded={false} // Children are collapsed by default
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileTreeNode;
