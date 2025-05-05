import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'fr', 'ar'],
  defaultLocale: 'en',
  localeDetection: true,
});

export async function middleware(request: NextRequest) {
  const isRouteProtected = (
    request.nextUrl.pathname.startsWith('/roadmap') ||
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/exercise')
  )

  if (!isRouteProtected) {
    // For non-protected routes, just apply the intl middleware
    return intlMiddleware(request);
  }
  
  // For protected routes:
  // First, handle authentication/session
  const response = await updateSession(request);
  
  // If the response is a redirect (user not authenticated), return it directly
  if (response.status === 302 || response.headers.has('location')) {
    return response;
  }
  
  // User is authenticated, now apply the intl middleware to the request
  // Create a new response by applying intlMiddleware to the original request
  const intlResponse = intlMiddleware(request);
  
  // Copy cookies from the auth response to the intl response to preserve the session
  response.cookies.getAll().forEach(cookie => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie.options);
  });
  
  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|.*\\..*).*)'
  ]
};