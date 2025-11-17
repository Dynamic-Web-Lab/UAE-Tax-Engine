/**
 * Next.js Middleware
 * Handles authentication and route protection
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/api/webhooks',
  ];

  // Check if path is public
  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  );

  // For API routes, allow through
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get auth token from cookie (Firebase sets this)
  const token = request.cookies.get('__session')?.value;

  // Redirect logic
  if (!isPublicPath && !token) {
    // Protected route without auth -> redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isPublicPath && token && (path.startsWith('/auth'))) {
    // Auth pages with token -> redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
