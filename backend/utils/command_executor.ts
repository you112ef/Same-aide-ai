import { spawn } from 'child_process';

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

export function executeCommand(command: string): Promise<CommandResult> {
  return new Promise((resolve) => {
    // Using shell: true is convenient but be aware of security implications if command is user-provided.
    // Here it's fine as we construct the commands ourselves.
    const child = spawn(command, { cwd: './', shell: true });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({ stdout, stderr, exitCode: code });
    });

    child.on('error', (err) => {
      resolve({ stdout: '', stderr: `Failed to start subprocess: ${err.message}`, exitCode: 1 });
    });
  });
}
