import { executeCommand } from '../utils/command_executor';
import fs from 'fs/promises';
import path from 'path';

interface StartupArgs {
  framework: 'vite' | 'next';
  projectName: string;
}

export async function startup({ framework, projectName }: StartupArgs): Promise<{ success: boolean; message:string; projectPath?: string }> {
  // Basic validation for project name to prevent command injection
  const safeProjectName = projectName.replace(/[^a-zA-Z0-9_-]/g, '');
  if (safeProjectName !== projectName) {
    return { success: false, message: `Invalid project name. Please use only letters, numbers, hyphens, and underscores.` };
  }

  const projectsDir = 'projects'; // All projects will be created in this directory
  const projectPath = path.join(projectsDir, safeProjectName);

  try {
    await fs.mkdir(projectsDir, { recursive: true });

    // Check if a directory with the project name already exists
    try {
      await fs.access(projectPath);
      return { success: false, message: `A project named '${safeProjectName}' already exists.` };
    } catch (e) {
      // This is good, the directory does not exist, so we can proceed.
    }

    let command: string;
    switch (framework) {
      case 'vite':
        // Scaffolds a new Vite project with the react-ts template non-interactively
        command = `bun create vite ${projectPath} --template react-ts`;
        break;
      case 'next':
        // Scaffolds a new Next.js project non-interactively
        command = `bunx create-next-app@latest ${projectPath} --typescript --eslint --tailwind --src-dir --app --import-alias "@/*"`;
        break;
      default:
        return { success: false, message: `Framework '${framework}' is not supported.` };
    }

    console.log(`Executing startup command: ${command}`);
    const result = await executeCommand(command);

    if (result.exitCode !== 0) {
      return { success: false, message: `Failed to create project. Error: ${result.stderr}` };
    }

    return { success: true, message: `Successfully created new ${framework} project: '${safeProjectName}'`, projectPath };

  } catch (error: any) {
    console.error(`An unexpected error occurred in startup tool:`, error);
    return { success: false, message: `An unexpected server error occurred: ${error.message}` };
  }
}
