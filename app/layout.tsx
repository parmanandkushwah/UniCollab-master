import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniCollab - Academic Collaboration Platform',
  description: 'Connect, Share, and Excel with your university community',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head /> {/* 👈 Next automatically injects metadata from above */}
      <body className={inter.className} style={{ overflow: 'visible' }}>
        <Providers>
          <div style={{ position: 'relative', zIndex: 0 }}>{children}</div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
