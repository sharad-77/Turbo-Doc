import path from 'path';
import { Piscina } from 'piscina';
import fs from 'fs';

const rootDir = process.cwd();

// 1. Look in the dist root (Production)
// The new tsup config guarantees the file is here:
const jsWorkerPath = path.resolve(rootDir, 'dist', 'document.worker.js');

// 2. Look in the src folder (Development fallback)
const tsWorkerPath = path.resolve(rootDir, 'src', 'workers', 'document.worker.ts');

// Check if the compiled file exists
const isJsWorkerAvailable = fs.existsSync(jsWorkerPath);
const workerFilename = isJsWorkerAvailable ? jsWorkerPath : tsWorkerPath;

console.log(`[DocumentPool] JS Available: ${isJsWorkerAvailable}`);
console.log(`[DocumentPool] Path: ${workerFilename}`);

export const documentPool = new Piscina({
  filename: workerFilename,
  minThreads: 1,
  maxThreads: 2,
  ...(!isJsWorkerAvailable && {
    execArgv: ['--import', 'tsx'],
  }),
});
