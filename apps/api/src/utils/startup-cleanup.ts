import fs from 'fs';
import path from 'path';
import { Paths } from './path.js';

/**
 * Startup Cleanup Utility
 * Removes old temporary files on server startup to prevent disk space issues
 */

/**
 * Cleans up temporary files older than the specified age
 * @param maxAgeMs - Maximum age of files to keep in milliseconds (default: 1 hour)
 */
export function cleanupTempFiles(maxAgeMs: number = 60 * 60 * 1000): void {
  console.log('🧹 Cleaning up old temporary files...');

  try {
    Paths.ensureFolders();
    const cutoffTime = Date.now() - maxAgeMs;

    // Clean raw folder
    const rawDir = path.join(process.cwd(), 'temp', 'raw');
    if (fs.existsSync(rawDir)) {
      const rawFiles = fs.readdirSync(rawDir);
      let cleanedCount = 0;

      rawFiles.forEach(file => {
        const filePath = path.join(rawDir, file);
        const stats = fs.statSync(filePath);
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      });

      if (cleanedCount > 0) {
        console.log(`   Cleaned ${cleanedCount} old files from temp/raw`);
      }
    }

    // Clean processed folder
    const processedDir = path.join(process.cwd(), 'temp', 'processed');
    if (fs.existsSync(processedDir)) {
      const processedFiles = fs.readdirSync(processedDir);
      let cleanedCount = 0;

      processedFiles.forEach(file => {
        const filePath = path.join(processedDir, file);
        const stats = fs.statSync(filePath);
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      });

      if (cleanedCount > 0) {
        console.log(`   Cleaned ${cleanedCount} old files from temp/processed`);
      }
    }

    console.log('✅ Temp file cleanup complete');
  } catch (err) {
    console.warn('⚠️  Temp file cleanup failed:', (err as Error).message);
  }
}
