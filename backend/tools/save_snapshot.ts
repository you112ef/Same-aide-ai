import { executeCommand } from '../utils/command_executor';

interface SaveSnapshotArgs {
  message: string;
}

export async function save_snapshot({ message }: SaveSnapshotArgs): Promise<{ success: boolean; message: string; commitHash?: string }> {
  try {
    // Stage all changes
    const addResult = await executeCommand('git add .');
    if (addResult.exitCode !== 0) {
      return { success: false, message: `git add failed: ${addResult.stderr}` };
    }

    // Commit the changes, escaping the message for the command line
    const escapedMessage = message.replace(/"/g, '\\"');
    const commitResult = await executeCommand(`git commit -m "Snapshot: ${escapedMessage}"`);

    // git commit returns exit code 1 if there's nothing to commit. This is not an error for us.
    if (commitResult.exitCode !== 0 && !commitResult.stdout.includes("nothing to commit")) {
      return { success: false, message: `git commit failed: ${commitResult.stderr}` };
    }

    // Get the latest commit hash
    const hashResult = await executeCommand('git rev-parse HEAD');
    if (hashResult.exitCode !== 0) {
      return { success: false, message: `Could not get commit hash: ${hashResult.stderr}` };
    }

    return { success: true, message: "Snapshot saved successfully.", commitHash: hashResult.stdout.trim() };

  } catch (error: any) {
    console.error("An unexpected error occurred in save_snapshot:", error);
    return { success: false, message: `An unexpected error occurred: ${error.message}` };
  }
}
