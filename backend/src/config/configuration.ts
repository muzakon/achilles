import * as fs from 'fs';

export default () => {
  const serviceAccountPath = __dirname + `/../../service_account.json`;
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Service account file not found at ${serviceAccountPath}. Please create a service account file and place it in the root directory.`,
    );
  }

  const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
  const serviceAccount = JSON.parse(serviceAccountData) as [any];

  return {
    GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME || null,
    JWT_SECRET: process.env.JWT_SECRET || null,
    FAL_AI_API_KEY: process.env.FAL_AI_API_KEY || null,
    SERVICE_ACCOUNT: serviceAccount || null,
  };
};
