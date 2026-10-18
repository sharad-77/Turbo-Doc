'use client';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

/**
 * Sleek global top loading bar that automatically appears during any active
 * TanStack query or mutation unless explicitly ignored via `meta.ignoreGlobalLoader: true`.
 */
export function GlobalLoadingBar() {
  const isFetching = useIsFetching({
    predicate: query => query.meta?.ignoreGlobalLoader !== true,
  });

  const isMutating = useIsMutating({
    predicate: mutation => mutation.meta?.ignoreGlobalLoader !== true,
  });

  const isLoading = isFetching > 0 || isMutating > 0;
  const [animating, setAnimating] = useState(false);
  const [prevLoading, setPrevLoading] = useState(isLoading);

  if (isLoading !== prevLoading) {
    setPrevLoading(isLoading);
    if (isLoading) {
      setAnimating(true);
    }
  }

  useEffect(() => {
    if (!isLoading && animating) {
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, animating]);

  const visible = isLoading || animating;

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20 overflow-hidden pointer-events-none"
    >
      <div
        className={`h-full bg-primary transition-all duration-300 ease-out ${
          isLoading ? 'w-2/3 animate-pulse' : 'w-full opacity-0'
        }`}
      />
    </div>
  );
}
