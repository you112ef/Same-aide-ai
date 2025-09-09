import { route } from './ai-router';
import { list_files } from './tools/list_files';
import { read_file } from './tools/read_file';
import { edit_file } from './tools/edit_file';
import { run_bash_command } from './tools/run_bash_command';
import { save_snapshot } from './tools/save_snapshot';
import { list_snapshots } from './tools/list_snapshots';
import { startup } from './tools/startup';
import { deploy } from './tools/deploy';
import type { ServerWebSocket } from 'bun';

const tools: { [key: string]: Function } = {
  list_files,
  read_file,
  edit_file,
  run_bash_command,
  save_snapshot,
  list_snapshots,
  startup,
  deploy,
};

const sockets = new Set<ServerWebSocket<unknown>>();

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

    if (server.upgrade(req)) {
      return;
    }

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
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (url.pathname === "/api/chat" && req.method === "POST") {
      try {
        const { message } = await req.json();
        const routeResult = await route(message);
        let responseData;

        if (routeResult && 'toolName' in routeResult) {
          const toolCall = routeResult;
          if (tools[toolCall.toolName]) {
            console.log(`Executing tool: ${toolCall.toolName} with args:`, toolCall.args);
            const toolArgs = { ...toolCall.args, broadcast };
            const toolResult = await tools[toolCall.toolName](toolArgs);
            responseData = { type: 'tool_result', toolName: toolCall.toolName, result: toolResult };
          } else {
            responseData = { type: 'chat_message', reply: `Error: AI tried to call unknown tool '${toolCall.toolName}'` };
          }
        } else if (routeResult && 'chatResponse' in routeResult) {
          responseData = { type: 'chat_message', reply: routeResult.chatResponse };
        } else {
          responseData = { type: 'chat_message', reply: "Sorry, I couldn't determine the next action." };
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
    open: (ws) => sockets.add(ws),
    close: (ws) => sockets.delete(ws),
    message: (ws, message) => console.log("Received WebSocket message:", message),
  },
  error: (error) => console.error("Server error:", error),
});

console.log(`Listening on http://localhost:${server.port} ...`);
