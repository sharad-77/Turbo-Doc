const isDevelopment = process.env.NODE_ENV === 'development';

function sanitize(data: unknown): unknown {
  if (typeof data === 'string') {
    return data.replace(/https?:\/\/[^\s]+/g, '[URL REDACTED]');
  }

  if (data && typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'url' || key === 'baseURL' || key === 'endpoint') {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(value);
      }
    }
    return sanitized;
  }

  return data;
}

class Logger {
  log(...args: unknown[]): void {
    if (isDevelopment) {
      console.log(...args);
    }
  }

  error(...args: unknown[]): void {
    if (isDevelopment) {
      const sanitizedArgs = args.map(arg => sanitize(arg));
      console.error(...sanitizedArgs);
    }
  }

  warn(...args: unknown[]): void {
    if (isDevelopment) {
      console.warn(...args);
    }
  }

  info(...args: unknown[]): void {
    if (isDevelopment) {
      console.info(...args);
    }
  }

  debug(...args: unknown[]): void {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
}

export const logger = new Logger();
