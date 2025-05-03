import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // First, handle authentication with Supabase
  const authResponse = await updateSession(request);
  
  // If the auth middleware redirected the user, return that response
  if (authResponse.status !== 200) {
    return authResponse;
  }
  
  // Otherwise, continue with internationalization middleware
  const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
  });
  
  // Apply the internationalization middleware to the request
  const response = intlMiddleware(request);
  
  // Copy cookies from the auth response to the intl response
  authResponse.cookies.getAll().forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  });
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|.*\\..*).*)'
  ]
};