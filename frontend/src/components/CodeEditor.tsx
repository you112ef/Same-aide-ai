import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  fileContent: string;
  filePath: string;
  onContentChange: (newContent: string) => void;
  onSave: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ fileContent, filePath, onContentChange, onSave }) => {

  const getLanguage = (filePath: string) => {
    const extension = filePath.split('.').pop();
    switch (extension) {
      case 'js': case 'jsx': return 'javascript';
      case 'ts': case 'tsx': return 'typescript';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  return (
    <div className="code-editor-container">
      <div className="code-editor-header">
        <h3>{filePath || "No File Selected"}</h3>
        <button onClick={onSave} disabled={!filePath}>Save</button>
      </div>
      <Editor
        height="calc(100% - 40px)" // Adjust height for the header
        language={getLanguage(filePath)}
        value={fileContent}
        onChange={(value) => onContentChange(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;
