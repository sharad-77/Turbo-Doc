import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { logger } from './logger';

let fingerprintPromise: Promise<string> | null = null;


export async function getFingerprint(): Promise<string> {
  if (!fingerprintPromise) {
    fingerprintPromise = (async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
      } catch (error) {
        logger.error('Failed to generate fingerprint:', error);
        // Fallback to a simple hash if fingerprinting fails
        return `fallback-${Math.random().toString(36).substring(2, 15)}`;
      }
    })();
  }
  return fingerprintPromise;
}
