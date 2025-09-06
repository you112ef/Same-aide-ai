interface ToolCall {
  toolName: string;
  args: any;
}

export function route(message: string): ToolCall | null {
  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes("list files") || lowerCaseMessage.includes("ls")) {
    return { toolName: "list_files", args: {} };
  }

  const readFileMatch = lowerCaseMessage.match(/read file `(.+?)`/);
  if (readFileMatch && readFileMatch[1]) {
    return { toolName: "read_file", args: { path: readFileMatch[1] } };
  }

  const readFileMatch2 = lowerCaseMessage.match(/read `(.+?)`/);
  if (readFileMatch2 && readFileMatch2[1]) {
    return { toolName: "read_file", args: { path: readFileMatch2[1] } };
  }

  return null; // No tool found, or it's a plain chat message
}
