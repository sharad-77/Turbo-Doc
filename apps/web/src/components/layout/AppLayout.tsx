'use client';

import { AppSidebar, MobileHeader } from '@/components/AppSidebar';
import { Footer } from '@/components/Footer';
import { ModeToggle } from '@/components/ModeToggle';
import { Navigation } from '@/components/Navigation';
import { usePreviewMode } from '@/contexts/PreviewModeContext';
import { SidebarProvider } from '@repo/ui/components/ui/sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = usePreviewMode();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <ModeToggle />
        <div className="pt-24 flex-1">{children}</div>
        <Footer />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <MobileHeader />
        <main className="flex-1 md:ml-0 pt-14 md:pt-0">
          <ModeToggle />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
