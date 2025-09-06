import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface BashCommandArgs {
  command: string;
}

interface BashCommandResult {
  stdout: string;
  stderr: string;
}

export async function run_bash_command({ command }: BashCommandArgs): Promise<BashCommandResult> {
  // A simple security check. In a real-world scenario, this would need to be
  // much more robust, likely involving whitelisted commands and sandboxing.
  if (command.trim().startsWith('sudo') || command.includes('rm -rf /')) {
    return {
      stdout: '',
      stderr: 'Error: Execution of potentially dangerous commands is blocked.',
    };
  }

  try {
    const { stdout, stderr } = await execAsync(command, {
      // The cwd for the sandbox should be the repository root.
      cwd: './',
    });
    return { stdout, stderr };
  } catch (error: any) {
    // execAsync rejects if the command returns a non-zero exit code.
    // The error object often contains stdout and stderr, which are important to capture.
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || `EXEC_ERROR: ${error.message}`,
    };
  }
}
