import fs from 'fs/promises';
import path from 'path';

interface ListFilesArgs {
  path?: string;
}

export async function list_files({ path: dirPath = '.' }: ListFilesArgs): Promise<{ files: string[] } | { error: string }> {
  try {
    // Security check to prevent path traversal
    if (dirPath.includes('..') || path.isAbsolute(dirPath)) {
      return { error: "Error: Path traversal is not allowed." };
    }

    const dirents = await fs.readdir(dirPath, { withFileTypes: true });
    // Add a trailing slash to directories
    const files = dirents.map(dirent => dirent.isDirectory() ? `${dirent.name}/` : dirent.name);
    return { files };
  } catch (error: any) {
    console.error(`Error in list_files tool for path '${dirPath}':`, error);
    return { error: `Error listing files in '${dirPath}': ${error.message}` };
  }
}
