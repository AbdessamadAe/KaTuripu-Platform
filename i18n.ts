import { getRequestConfig } from 'next-intl/server';

import { headers } from 'next/headers';

export const locales = ['en', 'fr', 'ar'];
export const defaultLocale = 'en';

export default getRequestConfig(async () => {
  const h = await headers(); // Await the Promise returned by headers()
  const detected = h.get('x-next-intl-locale'); // Set by middleware
  const locale = detected && locales.includes(detected) ? detected : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
