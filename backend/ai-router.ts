interface ToolCall {
  toolName: string;
  args: any;
}

export function route(message: string): ToolCall | null {
  const trimmedMessage = message.trim();

  // Rule for bash commands in a markdown block
  // e.g., ```bash\nls -l\n```
  const bashCommandRegex = /^```bash\n([\s\S]+?)\n```$/s;
  const bashMatch = trimmedMessage.match(bashCommandRegex);
  if (bashMatch && bashMatch[1]) {
    return {
      toolName: "run_bash_command",
      args: { command: bashMatch[1].trim() },
    };
  }

  // Rule for listing files
  const lowerCaseMessage = trimmedMessage.toLowerCase();
  if (lowerCaseMessage === "ls" || lowerCaseMessage === "list files") {
    return { toolName: "list_files", args: {} };
  }

  // Rule for reading files, e.g., "read `path/to/file.txt`"
  const readFileMatch = lowerCaseMessage.match(/^read `(.+?)`$/);
  if (readFileMatch && readFileMatch[1]) {
    return { toolName: "read_file", args: { path: readFileMatch[1] } };
  }

  // Rule for editing files, e.g., "edit `path/to/file.ts` with content:\n```tsx\n...\n```"
  const editFileRegex = /^edit `([^`]+)` with content:\s*```(?:\w*\n)?([\s\S]+?)```$/s;
  const editFileMatch = trimmedMessage.match(editFileRegex);

  if (editFileMatch && editFileMatch[1] && editFileMatch[2]) {
    return {
      toolName: "edit_file",
      args: {
        path: editFileMatch[1],
        content: editFileMatch[2].trim(),
      },
    };
  }

  // If no specific tool is matched, return null.
  return null;
}
