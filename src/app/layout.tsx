
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { ClientProviders } from '@/components/shared/ClientProviders';
import { CommandPalette } from '@/components/shared/CommandPalette';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SnipURL - URL Shortener & Analytics',
  description: 'Shorten URLs, track clicks, and analyze performance with SnipURL.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ClientProviders>
          {children}
          <CommandPalette />
        </ClientProviders>
      </body>
    </html>
  );
}
