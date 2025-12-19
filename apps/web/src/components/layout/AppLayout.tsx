'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AppSidebar, MobileHeader } from '@/components/AppSidebar';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';

import { useAuthStore } from '@/store/useAuthStore';

import { SidebarInset, SidebarProvider } from '@repo/ui/components/ui/sidebar';

const PUBLIC_ROUTES = [
  '/',
  '/signin',
  '/signup',
  '/pricing',
  '/image-resolution',
  '/convert',
  '/privacy-policy',
  '/refund-policy',
  '/cancellation-policy',
  '/contact',
  '/not-found',
];

const GUEST_ONLY_ROUTES = ['/', '/signin', '/signup'];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  // Define all known routes (both public and protected)
  const KNOWN_ROUTES = [
    '/',
    '/signin',
    '/signup',
    '/pricing',
    '/image-resolution',
    '/convert',
    '/privacy-policy',
    '/refund-policy',
    '/cancellation-policy',
    '/contact',
    '/not-found',
    '/dashboard',
    '/storage',
    '/payments',
    '/settings',
    '/profile',
  ];

  // Check if current path is a known route
  const isKnownRoute = KNOWN_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );

  // Treat unknown routes as public (404 pages)
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || !isKnownRoute;
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(pathname);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && isGuestOnlyRoute) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router, isGuestOnlyRoute]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Show public layout (no sidebar) for:
  // 1. Unauthenticated users on public routes
  // 2. ANY user on unknown routes (404 pages)
  if ((!isAuthenticated && isPublicRoute) || !isKnownRoute) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />

        <main className="flex-1 pt-24">{children}</main>

        <Footer />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen overflow-hidden w-full">
        <AppSidebar />

        <SidebarInset className="flex h-full flex-col">
          <MobileHeader />

          <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-6 md:pt-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
