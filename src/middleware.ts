import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'fr', 'ar'],
  defaultLocale: 'en',
  localeDetection: true,
});

export async function middleware(request: NextRequest) {
  // Create the intl response first
  const intlResponse = intlMiddleware(request);
  // Pass it to Supabase middleware to add session handling
  return await updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico|.*\\..*).*)'
  ]
};