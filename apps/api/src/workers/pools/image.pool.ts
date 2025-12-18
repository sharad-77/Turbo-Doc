import path from 'path';
import { Piscina } from 'piscina';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define potential worker paths
const jsWorkerPath = path.resolve(__dirname, '..', 'image.worker.js');
const tsWorkerPath = path.resolve(__dirname, '..', 'image.worker.ts');

// Check if the JS worker exists (typical for production builds)
const isJsWorkerAvailable = fs.existsSync(jsWorkerPath);

const workerFilename = isJsWorkerAvailable ? jsWorkerPath : tsWorkerPath;

export const imagePool = new Piscina({
  filename: workerFilename,
  minThreads: 1,
  maxThreads: 2, // Limit concurrency for t3.micro (1 vCPU)
  maxQueue: 100, // Prevent queue overflow
  // If we are using the TS worker (either in dev or tsx-production), we need a loader.
  // Prefer tsx if explicitly running in that mode, or fallback to dev defaults.
  ...(!isJsWorkerAvailable && {
    execArgv: ['--import', 'tsx'],
  }),
});
