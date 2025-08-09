
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { ClientProviders } from '@/components/shared/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SnipURL - The Ultimate URL Shortener',
  description: 'Create, share, and track your links with SnipURL.',
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
        </ClientProviders>
      </body>
    </html>
  );
}
