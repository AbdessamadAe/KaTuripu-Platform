import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import MathJaxProvider from "@/providers/MathJaxProvider";
import Nav from "@/components/Navigation";
import ToastProvider from "@/providers/ToastProvider";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "KaTuripu",
  description: "KaTuripu - Roadmaps",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;
  const messages = await getMessages(locale as any);

  return (
    <html lang={locale}>
      <body className={`antialiased min-h-screen w-full overflow-hidden`}>
        <QueryProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <AuthProvider>
              <ThemeProvider>
                <MathJaxProvider>
                  <Nav />
                  <div dir={locale == "ar" ? "rtl" : "ltr"} className={`${locale == "ar" ? 'font-amiri' : ''}`}>
                    {children}
                  </div>
                  <ToastProvider />
                </MathJaxProvider>
              </ThemeProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
