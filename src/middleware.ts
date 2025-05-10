import createIntlMiddleware from 'next-intl/middleware';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'fr', 'ar'],
  defaultLocale: 'en',
  localeDetection: true,
});

const isProtectedRoute = createRouteMatcher([
  '/roadmap(.*)',
  '/exercise(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Skip intlMiddleware for API routes
  if (pathname.startsWith('/api')) {
    if (isProtectedRoute(req)) await auth.protect();
    return;
  }

  if (isProtectedRoute(req)) await auth.protect();
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images|favicon.ico|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};