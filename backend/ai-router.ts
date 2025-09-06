import OpenAI from 'openai';

// This is where you'd securely get your API key, e.g., from process.env
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn("OPENAI_API_KEY environment variable not set. AI Router will not function.");
}

const openai = new OpenAI({
  apiKey: apiKey,
});

// Define the structure for a tool call that our application understands
export interface ToolCall {
  toolName: string;
  args: any;
}

// Define the tools available to the AI in the format OpenAI's API expects
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_files",
      description: "List all files and directories in the current project directory.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the entire content of a specified file.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "The path to the file to read." },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "edit_file",
      description: "Write or overwrite a file with new content.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "The path to the file to write." },
          content: { type: "string", description: "The new content for the file." },
        },
        required: ["path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "run_bash_command",
      description: "Execute a shell command.",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string", description: "The shell command to execute." },
        },
        required: ["command"],
      },
    },
  },
];

// The main router function that calls the AI model
export async function route(message: string): Promise<ToolCall | { chatResponse: string } | null> {
  if (!apiKey) {
    return { chatResponse: "AI provider is not configured. Please set the OPENAI_API_KEY environment variable." };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Or another model that supports tool calling
      messages: [
        {
          role: "system",
          content: "You are an expert AI software engineer. Your task is to help the user build and modify their web application. Based on the user's request, you must decide whether to call one of the available tools or to respond with a clarifying question or a message. Only call one tool at a time.",
        },
        { role: "user", content: message }
      ],
      tools: tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      // The AI decided to call a tool
      const toolCall = toolCalls[0]; // For now, we only handle the first tool call
      return {
        toolName: toolCall.function.name,
        args: JSON.parse(toolCall.function.arguments),
      };
    } else {
      // The AI decided to respond with a chat message
      return { chatResponse: responseMessage.content || "I don't have a response for that." };
    }

  } catch (error: any) {
    console.error("Error calling OpenAI API:", error);
    return { chatResponse: `An error occurred with the AI provider: ${error.message}` };
  }
}
