import fs from 'fs';
import path from 'path';
import { Piscina } from 'piscina';

const rootDir = process.cwd();

const jsWorkerPath = path.resolve(rootDir, 'dist', 'image.worker.js');

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
