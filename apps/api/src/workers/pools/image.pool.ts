import path from 'path';
import { Piscina } from 'piscina';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if we are running in a TypeScript environment (like tsx)
const isTs = path.extname(__filename) === '.ts';

export const imagePool = new Piscina({
  filename: path.resolve(__dirname, `../image.worker.${isTs ? 'ts' : 'js'}`),
  maxThreads: 2, // Requirement: limit concurrency to 2
  ...(isTs && {
    execArgv: ['--loader', 'ts-node/esm', '--no-warnings'], // Use 'ts-node' loader for worker threads in dev
    workerData: {
      fullpath: path.resolve(__dirname, `../image.worker.ts`),
    },
  }),
});
