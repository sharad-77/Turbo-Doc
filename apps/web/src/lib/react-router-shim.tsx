/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import NextLink from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useNavigate() {
  const router = useRouter();
  return (path: string | number) => {
    if (typeof path === 'number') {
      if (path === -1) router.back();
      // forward not easily supported but rare
    } else {
      router.push(path);
    }
  };
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  };
}

// Shim Link to support 'to' prop
export const Link = ({ to, children, ...props }: any) => {
  return (
    <NextLink href={to || '#'} {...props}>
      {children}
    </NextLink>
  );
};

export const NavLink = ({ to, children, className, ...props }: any) => {
  const pathname = usePathname();
  const isActive = pathname === to;
  // This is a basic shim, might need more complex isActive logic
  const finalClassName = typeof className === 'function' ? className({ isActive }) : className;
  return (
    <NextLink href={to || '#'} className={finalClassName} {...props}>
      {children}
    </NextLink>
  );
};

export const BrowserRouter = ({ children }: any) => <>{children}</>;
export const Routes = ({ children }: any) => <>{children}</>;
export const Route = () => null;
export const Outlet = ({ children }: any) => <>{children}</>; // Usually Outlet implies nested layout, which we handle via Next.js
