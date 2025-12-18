import path from 'path';
import { Piscina } from 'piscina';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use NODE_ENV for more reliable production detection
const isProduction = process.env.NODE_ENV === 'production';

export const documentPool = new Piscina({
  filename: path.resolve(__dirname, isProduction ? '../document.worker.js' : '../document.worker.ts'),
  minThreads: 1,
  maxThreads: 2, // Limit concurrency for t3.micro (1 vCPU)
  maxQueue: 100, // Prevent queue overflow
  ...(!isProduction && {
    execArgv: ['--loader', 'ts-node/esm', '--no-warnings'],
  }),
});
