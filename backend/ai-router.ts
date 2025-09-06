interface ToolCall {
  toolName: string;
  args: any;
}

export function route(message: string): ToolCall | null {
  const lowerCaseMessage = message.toLowerCase().trim();

  // Rule for listing files
  if (lowerCaseMessage === "ls" || lowerCaseMessage === "list files") {
    return { toolName: "list_files", args: {} };
  }

  // Rule for reading files, e.g., "read `path/to/file.txt`"
  const readFileMatch = lowerCaseMessage.match(/^read `(.+?)`$/);
  if (readFileMatch && readFileMatch[1]) {
    return { toolName: "read_file", args: { path: readFileMatch[1] } };
  }

  // Rule for editing files, e.g., "edit `path/to/file.ts` with content:\n```tsx\n...\n```"
  // This regex captures the file path and the content within the code block.
  // The 's' flag allows '.' to match newlines.
  const editFileRegex = /^edit `([^`]+)` with content:\s*```(?:\w*\n)?([\s\S]+?)```$/s;
  const editFileMatch = message.trim().match(editFileRegex);

  if (editFileMatch && editFileMatch[1] && editFileMatch[2]) {
    return {
      toolName: "edit_file",
      args: {
        path: editFileMatch[1],
        content: editFileMatch[2].trim(), // Get the content from the code block
      },
    };
  }

  // If no specific tool is matched, return null.
  return null;
}
