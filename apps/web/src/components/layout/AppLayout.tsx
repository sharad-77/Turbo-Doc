'use client';

import { AppSidebar, MobileHeader } from '@/components/AppSidebar';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { SidebarProvider } from '@repo/ui/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = ['/', '/signin', '/signup', '/pricing', '/image-resolution', '/convert'];
  const guestRoutes = ['/', '/signin', '/signup'];

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && guestRoutes.includes(pathname)) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (!isAuthenticated && publicRoutes.includes(pathname)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="pt-24 flex-1">{children}</div>
        <Footer />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <MobileHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 pt-16 md:pt-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
