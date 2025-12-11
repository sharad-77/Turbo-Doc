import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@repo/ui/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/ui/sheet';
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
  useSidebar,
} from '@repo/ui/components/ui/sidebar';
import { motion } from 'framer-motion';
import {
  CreditCard,
  FileText,
  HardDrive,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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

// Mobile Sidebar Content Component
const MobileSidebarContent = ({ onClose }: { onClose: () => void }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-space-grotesk font-semibold">TurboDoc</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link
                to={item.url}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.url
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

// Mobile Header with Hamburger
export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-space-grotesk font-semibold">TurboDoc</span>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <MobileSidebarContent onClose={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <Sidebar
        collapsible="icon"
        className="border-r border-border hidden md:flex transition-all duration-300"
      >
        <SidebarHeader className="border-b border-border p-3 lg:p-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-primary-foreground" />
            </div>
            <span className="text-sm lg:text-base font-space-grotesk font-semibold group-data-[collapsible=icon]:hidden truncate">
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
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                      className="px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-lg transition-all duration-200"
                    >
                      <Link to={item.url} className="flex items-center gap-2.5">
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
          <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 group-data-[collapsible=icon]:hidden text-xs lg:text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
