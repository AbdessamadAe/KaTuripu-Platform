import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localeDetection: true,
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth session update on public/auth pages
  if (
    pathname.startsWith('/home') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/error') ||
    pathname.startsWith('/api')
  ) {
    return intlMiddleware(request);
  }

  // Refresh Supabase session for protected routes
  const sessionResponse = await updateSession(request);

  // Apply i18n logic on top of session handling
  return intlMiddleware(request, sessionResponse);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|.*\\..*).*)'
  ]
};