import type { Job } from '../types/worker.types.js';

export const jobStore = new Map<string, Job>();
