/**
 * Root Layout - FIXED: Added Error Boundary and SEO improvements
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../lib/i18n/config';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LayoutClient } from '@/components/LayoutClient';

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
  openGraph: {
    title: 'UAE Tax Engine - Real-Time Tax Dashboard',
    description: 'Live tax tracking for UAE SMEs & Freelancers',
    type: 'website',
    locale: 'en_AE',
    alternateLocale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UAE Tax Engine',
    description: 'Real-Time Tax Dashboard for UAE businesses',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <LayoutClient>{children}</LayoutClient>
        </ErrorBoundary>
      </body>
    </html>
  );
}
