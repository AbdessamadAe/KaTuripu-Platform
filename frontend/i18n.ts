import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "fr", "ar"];
export const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
    if (!locale || !locales.includes(locale)) {
        locale = defaultLocale;
    }
    
    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    }
});