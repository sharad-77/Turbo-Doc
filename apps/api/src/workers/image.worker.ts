import path from 'path';
import { Piscina } from 'piscina';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

let jsWorkerPath: string;
let tsWorkerPath: string;

if (isProduction) {
  jsWorkerPath = path.resolve(__dirname, '..', 'document.worker.js');
  tsWorkerPath = path.resolve(__dirname, '..', 'document.worker.ts');
} else {
  jsWorkerPath = path.resolve(__dirname, '..', 'document.worker.js');
  tsWorkerPath = path.resolve(__dirname, '..', 'document.worker.ts');
}

const isJsWorkerAvailable = fs.existsSync(jsWorkerPath);

const workerFilename = isJsWorkerAvailable ? jsWorkerPath : tsWorkerPath;

console.log(`[DocumentPool] Using worker: ${workerFilename}`);
console.log(`[DocumentPool] JS worker available: ${isJsWorkerAvailable}`);

export const documentPool = new Piscina({
  filename: workerFilename,
  minThreads: 1,
  maxThreads: 2,
  maxQueue: 100,
  ...(!isJsWorkerAvailable && {
    execArgv: ['--import', 'tsx'],
  }),
});
