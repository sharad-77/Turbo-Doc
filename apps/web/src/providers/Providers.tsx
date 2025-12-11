'use client';

import { PreviewModeProvider } from '@/contexts/PreviewModeContext';
import { Toaster as Sonner } from '@repo/ui/components/ui/sonner';
import { Toaster } from '@repo/ui/components/ui/toaster';
import { TooltipProvider } from '@repo/ui/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <PreviewModeProvider>
          <TooltipProvider>
            {children}
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </PreviewModeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
