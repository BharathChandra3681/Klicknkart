import type { Metadata } from 'next';
import './globals.css';
import { CustomerProvider } from '@/context/CustomerContext';
import SiteShell from '@/components/SiteShell';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: { default: 'KlicknKart', template: '%s | KlicknKart' },
  description: 'Premium stationery & business solutions for modern professionals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <CustomerProvider>
          <SiteShell>
            {children}
          </SiteShell>
        </CustomerProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
