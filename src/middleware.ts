import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localeDetection: true,
});

export async function middleware(request: NextRequest) {

  if (request.redirect) {
    return intlMiddleware(request);
  }

  // Refresh Supabase session for protected routes
  const sessionResponse = await updateSession(request);
  
  return sessionResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|.*\\..*).*)'
  ]
};