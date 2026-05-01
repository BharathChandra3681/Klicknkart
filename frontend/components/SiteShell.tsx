'use client';

import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import Navbar from './Navbar';

const AUTH_PATHS = ['/account/login', '/account/register'];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.includes(pathname);

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
    </CartProvider>
  );
}
