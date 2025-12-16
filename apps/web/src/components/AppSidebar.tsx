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
  useSidebar
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
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/dashboard',
  },
  {
    title: 'Document Tools',
    icon: FileText,
    url: '/convert',
  },
  {
    title: 'Image Resolution',
    icon: Image,
    url: '/image-resolution',
  },
  {
    title: 'Storage',
    icon: HardDrive,
    url: '/storage',
  },
  {
    title: 'Payments',
    icon: CreditCard,
    url: '/payments',
  },
  {
    title: 'Settings',
    icon: Settings,
    url: '/settings',
  },
  {
    title: 'Profile',
    icon: User,
    url: '/profile',
  },
];

// Mobile Header with Hamburger - uses SidebarTrigger
export function MobileHeader() {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-space-grotesk font-semibold">TurboDoc</span>
        </div>

        {/* Use the built-in SidebarTrigger instead of custom button */}
        <SidebarTrigger className="h-9 w-9" />
      </div>
    </div>
  );
}

// Main Sidebar Component - works for both mobile and desktop
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-border p-3 lg:p-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 lg:w-8 lg:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-primary-foreground" />
          </div>
          <span className="text-sm lg:text-base font-space-grotesk font-semibold truncate">
            TurboDoc
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 lg:p-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-2 py-1.5">
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
                    className="px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-lg transition-all duration-200"
                  >
                    <Link href={item.url} className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{item.title}</span>
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
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
