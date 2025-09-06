import { route } from './ai-router';
import { list_files } from './tools/list_files';
import { read_file } from './tools/read_file';

// A map to hold our tools for easy lookup
const tools: { [key: string]: Function } = {
  list_files: list_files,
  read_file: read_file,
};

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle pre-flight requests for CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === "/api") {
      return new Response(JSON.stringify({ message: "Hello from OpenAnalyst! I'm ready to help you with your project." }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (url.pathname === "/api/chat" && req.method === "POST") {
      try {
        const { message } = await req.json();

        // 1. Route the message to a potential tool call
        const toolCall = route(message);

        let responseData;

        if (toolCall && tools[toolCall.toolName]) {
          // 2. A tool is found, execute it with the provided arguments
          console.log(`Executing tool: ${toolCall.toolName} with args:`, toolCall.args);
          const toolResult = await tools[toolCall.toolName](toolCall.args);
          responseData = { type: 'tool_result', toolName: toolCall.toolName, result: toolResult };
        } else {
          // 3. No tool found, treat as a general chat message
          // This part will be replaced by a call to a real AI chat model in the future
          responseData = {
            type: 'chat_message',
            reply: `AI: I don't have a tool for that. You said: "${message}"`
          };
        }

        return new Response(JSON.stringify(responseData), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });

      } catch (error: any) {
        console.error("Error in /api/chat:", error);
        return new Response(JSON.stringify({ error: `An internal error occurred: ${error.message}` }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    return new Response("Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
