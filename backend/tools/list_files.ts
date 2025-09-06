import fs from 'fs/promises';

export async function list_files(): Promise<{ files: string[] } | { error: string }> {
  try {
    // The current working directory in the sandbox should be the repo root.
    const dirents = await fs.readdir('./', { withFileTypes: true });
    // Add a trailing slash to directories
    const files = dirents.map(dirent => dirent.isDirectory() ? `${dirent.name}/` : dirent.name);
    return { files };
  } catch (error: any) {
    console.error("Error in list_files tool:", error);
    return { error: `Error listing files: ${error.message}` };
  }
}
