import fs from 'fs';
import path from 'path';

const root = process.cwd();

export const Paths = {
  raw: (fileName: string) => path.join(root, 'temp', 'raw', fileName),
  processed: (fileName: string) => path.join(root, 'temp', 'processed', fileName),

  ensureFolders: () => {
    const folders = [
      path.join(root, 'temp'),
      path.join(root, 'temp/raw'),
      path.join(root, 'temp/processed'),
    ];

    for (const f of folders) {
      if (!fs.existsSync(f)) fs.mkdirSync(f);
    }
  },
};
