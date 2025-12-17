import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fingerprintPromise: Promise<string> | null = null;

/**
 * Get browser fingerprint for guest user tracking
 * Uses FingerprintJS to generate a unique identifier
 * Cached after first call for performance
 */
export async function getFingerprint(): Promise<string> {
  if (!fingerprintPromise) {
    fingerprintPromise = (async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
      } catch (error) {
        console.error('Failed to generate fingerprint:', error);
        // Fallback to a simple hash if fingerprinting fails
        return `fallback-${Math.random().toString(36).substring(2, 15)}`;
      }
    })();
  }
  return fingerprintPromise;
}
