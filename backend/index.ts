import { route } from './ai-router';
import { list_files } from './tools/list_files';
import { read_file } from './tools/read_file';
import { edit_file } from './tools/edit_file';
import { run_bash_command } from './tools/run_bash_command';
import type { ServerWebSocket } from 'bun';

// A map to hold our tools for easy lookup
const tools: { [key: string]: Function } = {
  list_files: list_files,
  read_file: read_file,
  edit_file: edit_file,
  run_bash_command: run_bash_command,
};

// A set to store all active WebSocket connections
const sockets = new Set<ServerWebSocket<unknown>>();

// Function to broadcast a message to all connected WebSocket clients
export function broadcast(message: object) {
  const messageString = JSON.stringify(message);
  for (const socket of sockets) {
    socket.send(messageString);
  }
}

const server = Bun.serve({
  port: 3000,
  async fetch(req, server) {
    const url = new URL(req.url);

    // Handle WebSocket upgrade requests
    if (server.upgrade(req)) {
      return; // Bun handles the response for you
    }

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

    // Handle regular HTTP API requests
    if (url.pathname === "/api") {
      return new Response(JSON.stringify({ message: "Hello from OpenAnalyst! I'm ready to help you with your project." }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (url.pathname === "/api/chat" && req.method === "POST") {
      try {
        const { message } = await req.json();
        const toolCall = route(message);
        let responseData;

        if (toolCall && tools[toolCall.toolName]) {
          console.log(`Executing tool: ${toolCall.toolName} with args:`, toolCall.args);
          // Pass the broadcast function to the tool if it needs it
          const toolArgs = { ...toolCall.args, broadcast };
          const toolResult = await tools[toolCall.toolName](toolArgs);
          responseData = { type: 'tool_result', toolName: toolCall.toolName, result: toolResult };
        } else {
          responseData = { type: 'chat_message', reply: `AI: I don't have a tool for that. You said: "${message}"` };
        }

        return new Response(JSON.stringify(responseData), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (error: any) {
        console.error("Error in /api/chat:", error);
        return new Response(JSON.stringify({ error: `An internal error occurred: ${error.message}` }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) {
      console.log("WebSocket connection opened.");
      sockets.add(ws);
    },
    message(ws, message) {
      console.log("Received WebSocket message:", message);
      // We can add logic here later if needed
    },
    close(ws, code, reason) {
      console.log("WebSocket connection closed.", code, reason);
      sockets.delete(ws);
    },
  },
  error(error) {
    console.error("Server error:", error);
    return new Response("An unexpected error occurred", { status: 500 });
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
