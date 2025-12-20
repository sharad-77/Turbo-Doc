import fs from 'fs';
import path from 'path';
import { Piscina } from 'piscina';

const rootDir = process.cwd();

const jsWorkerPath = path.resolve(rootDir, 'dist', 'document.worker.js');

const tsWorkerPath = path.resolve(rootDir, 'src', 'workers', 'document.worker.ts');

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
