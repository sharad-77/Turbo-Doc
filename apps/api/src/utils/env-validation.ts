/**
 * Environment Variable Validation
 * Validates that all required environment variables are set before server startup
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'AWS_BUCKET_NAME',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'BETTER_AUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

/**
 * Validates that all required environment variables are present
 * Exits the process if any are missing
 */
export function validateEnvironment(): void {
  console.log('🔍 Validating environment variables...');

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
}
