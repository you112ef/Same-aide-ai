import { spawn } from 'child_process';

type BroadcastFunction = (message: object) => void;

interface BashCommandArgs {
  command: string;
  broadcast: BroadcastFunction;
}

interface BashCommandResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

export function run_bash_command({ command, broadcast }: BashCommandArgs): Promise<BashCommandResult> {
  return new Promise((resolve) => {
    // Basic security check
    if (command.trim().startsWith('sudo') || command.includes('rm -rf /')) {
      const result = {
        stdout: '',
        stderr: 'Error: Execution of potentially dangerous commands is blocked.',
        exitCode: 1,
      };
      // Broadcast the error as well
      broadcast({ type: 'tool_stream', toolName: 'run_bash_command', stream: { stderr: result.stderr } });
      resolve(result);
      return;
    }

    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, {
      cwd: './',
      shell: true, // Use shell to handle complex commands, pipes, etc.
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const chunk = data.toString();
      stdout += chunk;
      // Broadcast the stdout chunk to all clients
      broadcast({ type: 'tool_stream', toolName: 'run_bash_command', stream: { stdout: chunk } });
    });

    child.stderr.on('data', (data) => {
      const chunk = data.toString();
      stderr += chunk;
      // Broadcast the stderr chunk to all clients
      broadcast({ type: 'tool_stream', toolName: 'run_bash_command', stream: { stderr: chunk } });
    });

    child.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
      // Resolve the promise with the final collected output
      resolve({ stdout, stderr, exitCode: code });
    });

    child.on('error', (err) => {
      console.error('Failed to start subprocess.', err);
      stderr += `\nFailed to start subprocess: ${err.message}`;
      // Resolve the promise on error as well
      resolve({ stdout, stderr, exitCode: 1 });
    });
  });
}
