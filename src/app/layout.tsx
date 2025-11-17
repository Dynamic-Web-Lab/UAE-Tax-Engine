/**
 * Root Layout with i18n and font configuration
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../lib/i18n/config';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'UAE Tax Engine - Real-Time Tax Dashboard',
  description:
    'Live tax tracking for UAE SMEs & Freelancers. Monitor your 0% and 9% tax brackets in real-time with AI-powered insights.',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'UAE Tax Engine',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
