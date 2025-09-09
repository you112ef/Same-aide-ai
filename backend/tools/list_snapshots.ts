import { executeCommand } from '../utils/command_executor';

interface Snapshot {
  hash: string;
  message: string;
}

export async function list_snapshots(): Promise<{ snapshots: Snapshot[] } | { error: string }> {
  try {
    // Use a custom format for easy parsing. %h: abbreviated hash, %s: subject (commit message)
    const logResult = await executeCommand('git log --pretty=format:"%h|%s"');

    if (logResult.exitCode !== 0) {
      return { error: `git log failed: ${logResult.stderr}` };
    }

    // Handle case with no commits yet
    if (logResult.stdout.trim() === '') {
      return { snapshots: [] };
    }

    // Parse the output into an array of objects
    const snapshots = logResult.stdout.trim().split('\n').map(line => {
      const [hash, message] = line.split('|');
      return { hash, message };
    });

    return { snapshots };

  } catch (error: any) {
    console.error("An unexpected error occurred in list_snapshots:", error);
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}
