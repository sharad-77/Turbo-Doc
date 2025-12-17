'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AppSidebar, MobileHeader } from '@/components/AppSidebar';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';

import { useAuthStore } from '@/store/useAuthStore';

import { SidebarProvider, SidebarInset } from '@repo/ui/components/ui/sidebar';

const PUBLIC_ROUTES = ['/', '/signin', '/signup', '/pricing', '/image-resolution', '/convert'];

const GUEST_ONLY_ROUTES = ['/', '/signin', '/signup'];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && GUEST_ONLY_ROUTES.includes(pathname)) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
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
