import { defineConfig } from 'tsup';

export default defineConfig({
  // USING AN OBJECT HERE IS THE FIX
  // It tells tsup: "Take src/workers/document.worker.ts and save it as dist/document.worker.js"
  entry: {
    index: 'src/index.ts',
    'document.worker': 'src/workers/document.worker.ts',
    'image.worker': 'src/workers/image.worker.ts',
  },
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  clean: true,
  shims: true,
  splitting: false, // Keeps workers as single independent files
  noExternal: ['@repo/auth', '@repo/database', '@repo/file-upload', '@repo/zod-schemas', 'pg'],
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
});
