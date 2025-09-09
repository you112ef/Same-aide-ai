import fs from 'fs/promises';

export async function read_file({ path }: { path: string }): Promise<{ content: string } | { error: string }> {
  try {
    // Basic security check to prevent path traversal attacks
    if (path.includes('..') || path.startsWith('/')) {
        return { error: "Error: Path traversal is not allowed." };
    }
    const content = await fs.readFile(path, 'utf-8');
    return { content };
  } catch (error: any) {
    console.error(`Error in read_file tool for path '${path}':`, error);
    return { error: `Error reading file '${path}': ${error.message}` };
  }
}
