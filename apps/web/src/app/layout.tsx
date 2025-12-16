import { AppLayout } from '@/components/layout/AppLayout';
import { Providers } from '@/providers/Providers';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google'; // Import fonts
import React from 'react';
import './globals.css';

// Configure fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Lovable Frontend',
  description: 'Converted from React',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} antialiased font-sans`}>
        <Providers>
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">Loading...</div>
            }
          >
            <AppLayout>{children}</AppLayout>
          </React.Suspense>
        </Providers>
      </body>
    </html>
  );
}
