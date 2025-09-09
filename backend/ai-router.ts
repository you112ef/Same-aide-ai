import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn("OPENAI_API_KEY environment variable not set. AI Router will not function.");
}

const openai = new OpenAI({ apiKey });

export interface ToolCall {
  toolName: string;
  args: any;
}

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_files",
      description: "List all files and directories in a specified project directory. Defaults to the root directory.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "The path to the directory to list. e.g., 'src/components'. Optional.",
          },
        },
      },
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
  {
    type: "function",
    function: {
      name: "save_snapshot",
      description: "Save the current state of the project as a snapshot (commit) with a descriptive message.",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string", description: "A descriptive message for the snapshot." },
        },
        required: ["message"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_snapshots",
      description: "List all the previously saved snapshots (commits) of the project.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "startup",
      description: "Create a new web application project from a template.",
      parameters: {
        type: "object",
        properties: {
          framework: {
            type: "string",
            description: "The framework to use for the new project.",
            enum: ["vite", "next"],
          },
          projectName: {
            type: "string",
            description: "The name of the new project directory.",
          },
        },
        required: ["framework", "projectName"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deploy",
      description: "Deploy the frontend project to Vercel.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

export async function route(message: string): Promise<ToolCall | { chatResponse: string } | null> {
  if (!apiKey) {
    return { chatResponse: "AI provider is not configured. Please set the OPENAI_API_KEY environment variable." };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
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
      const toolCall = toolCalls[0];
      return {
        toolName: toolCall.function.name,
        args: JSON.parse(toolCall.function.arguments),
      };
    } else {
      return { chatResponse: responseMessage.content || "I don't have a response for that." };
    }

  } catch (error: any) {
    console.error("Error calling OpenAI API:", error);
    return { chatResponse: `An error occurred with the AI provider: ${error.message}` };
  }
}
