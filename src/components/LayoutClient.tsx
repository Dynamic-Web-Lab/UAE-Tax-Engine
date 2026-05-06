'use client';

/**
 * Layout Client Wrapper - Handles client-side components like ConsentBanner and Footer
 */

import { ReactNode } from 'react';
import { ConsentBanner } from '@/components/ConsentBanner';
import { Footer } from '@/components/Footer';

interface LayoutClientProps {
  children: ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  return (
    <>
      {children}
      <Footer />
      <ConsentBanner />
    </>
  );
}
