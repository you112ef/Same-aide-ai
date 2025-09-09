import fs from 'fs/promises';
import path from 'path';

interface EditFileArgs {
  path: string;
  content: string;
}

export async function edit_file({ path: filePath, content }: EditFileArgs): Promise<{ message: string } | { error: string }> {
  try {
    // Basic security check to prevent path traversal attacks
    if (filePath.includes('..') || filePath.startsWith('/')) {
      return { error: "Error: Path traversal is not allowed." };
    }

    const dir = path.dirname(filePath);
    // Ensure the directory exists before writing the file.
    // This is helpful for creating new files in new subdirectories.
    if (dir !== '.') {
      await fs.mkdir(dir, { recursive: true });
    }

    await fs.writeFile(filePath, content, 'utf-8');

    return { message: `Successfully edited ${filePath}` };
  } catch (error: any) {
    console.error(`Error in edit_file tool for path '${filePath}':`, error);
    return { error: `Error editing file '${filePath}': ${error.message}` };
  }
}
