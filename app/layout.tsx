import './globals.css'; // ✅ Or '../styles/globals.css' depending on actual file location
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniCollab - Academic Collaboration Platform',
  description: 'Connect, Share, and Excel with your university community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ overflow: 'visible' }}>
        <Providers>
          <div style={{ position: 'relative', zIndex: 0 }}>
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
