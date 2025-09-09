import { executeCommand } from '../utils/command_executor';

export async function deploy(): Promise<{ success: boolean; message: string; deploymentUrl?: string }> {
  const token = process.env.VERCEL_TOKEN;
  const orgId = process.env.VERCEL_ORG_ID;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !orgId || !projectId) {
    const errorMessage = "Vercel environment variables (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID) are not set. Cannot deploy.";
    console.error(errorMessage);
    return { success: false, message: errorMessage };
  }

  try {
    // Construct the command to deploy the 'frontend' project non-interactively.
    // We link it to a specific project and organization.
    // The '--prod' flag creates a production deployment.
    // This command assumes the Vercel project is already linked and configured
    // with the correct root directory ('frontend') in the Vercel UI.
    const command = `npx vercel --prod --token ${token} --scope ${orgId}`;

    console.log(`Executing deploy command...`);
    const result = await executeCommand(command);

    if (result.exitCode !== 0) {
      return { success: false, message: `Deployment failed: ${result.stderr}` };
    }

    // Vercel CLI outputs the deployment URL. We need to parse it from stdout.
    const deploymentUrlMatch = result.stdout.match(/https:\/\/[^\s]+\.vercel\.app/);
    const deploymentUrl = deploymentUrlMatch ? deploymentUrlMatch[0] : "URL not found in output";

    return { success: true, message: "Deployment successful!", deploymentUrl };

  } catch (error: any) {
    console.error(`An unexpected error occurred in deploy tool:`, error);
    return { success: false, message: `An unexpected server error occurred: ${error.message}` };
  }
}
