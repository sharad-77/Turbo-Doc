'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@repo/ui/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@repo/ui/components/ui/sidebar';
import {
  CreditCard,
  FileText,
  HardDrive,
  Image,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
  { title: 'Document Tools', icon: FileText, url: '/convert' },
  { title: 'Image Resolution', icon: Image, url: '/image-resolution' },
  { title: 'Storage', icon: HardDrive, url: '/storage' },
  { title: 'Payments', icon: CreditCard, url: '/payments' },
  { title: 'Settings', icon: Settings, url: '/settings' },
  { title: 'Profile', icon: User, url: '/profile' },
];

export function MobileHeader() {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <FileText className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-space-grotesk text-sm font-semibold">TurboDoc</span>
      </div>
      <SidebarTrigger className="h-9 w-9" />
    </header>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && openMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsible="none"
        side="left"
        variant="sidebar"
        className={`
          md:relative md:translate-x-0
          fixed top-0 left-0 bottom-0 z-50 pt-14 md:pt-0
          transition-transform duration-300 ease-in-out
          ${isMobile && !openMobile ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <SidebarHeader className="border-b border-border p-3 lg:p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary lg:h-8 lg:w-8">
              <FileText className="h-4 w-4 text-primary-foreground lg:h-5 lg:w-5" />
            </div>
            <span className="truncate font-space-grotesk text-sm font-semibold lg:text-base">
              TurboDoc
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2 lg:p-3">
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 py-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {menuItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className="rounded-lg px-2.5 py-2 transition-all duration-200 lg:px-3 lg:py-2.5"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2.5"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-2 lg:p-3">
          <div className="flex items-center justify-between gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs lg:text-sm"
              onClick={() => useAuthStore.getState().logout()}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Logout</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
