import path from 'path';
import { Piscina } from 'piscina';
import fs from 'fs';

const rootDir = process.cwd();

// 1. Look in the dist root (Production)
const jsWorkerPath = path.resolve(rootDir, 'dist', 'image.worker.js');

// 2. Look in the src folder (Development fallback)
const tsWorkerPath = path.resolve(rootDir, 'src', 'workers', 'image.worker.ts');

const isJsWorkerAvailable = fs.existsSync(jsWorkerPath);
const workerFilename = isJsWorkerAvailable ? jsWorkerPath : tsWorkerPath;

console.log(`[ImagePool] JS Available: ${isJsWorkerAvailable}`);
console.log(`[ImagePool] Path: ${workerFilename}`);

export const imagePool = new Piscina({
  filename: workerFilename,
  minThreads: 1,
  maxThreads: 2,
  ...(!isJsWorkerAvailable && {
    execArgv: ['--import', 'tsx'],
  }),
});
