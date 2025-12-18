import type { Job } from './types/worker.types.js'; // Ensure extension matches what we can use
import { imagePool } from './workers/pools/image.pool.js';

const mockJob: Job = {
  jobId: 'test-job',
  type: 'image',
  task: 'resize', // Valid task to hit the switch
  data: {
    key: 'mock-key',
    scalePercent: 50,
  },
  status: 'queued',
  createdAt: new Date(),
};

async function run() {
  console.log('Starting worker test...');
  try {
    // This should trigger the worker thread startup
    await imagePool.run(mockJob);
    console.log('Worker finished (unexpected success if testing for crash)');
  } catch (err: any) {
    console.error('Captured Error:', err);
    // Print full details if available
    if (err.message) console.error('Message:', err.message);
    if (err.code) console.error('Code:', err.code);
  }
}

run();
