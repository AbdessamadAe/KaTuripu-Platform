import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {NextIntlClientProvider} from "next-intl";
import { getMessages } from "next-intl/server";
import MathJaxProvider from "@/components/MathJaxProvider";
import Nav from "@/components/Nav";
import ToastProvider from "@/components/ToastProvider";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
  const {locale} = await params;
  const messages = await getMessages(locale as any);
  
  return (
    <html lang={locale}>
      <body className={`antialiased min-h-screen w-full overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProvider>
          <MathJaxProvider>
                <Nav />
                <div dir={locale == "ar" ? "rtl" : "ltr"} className={`${locale == "ar" ? 'font-amiri' : ''}`}>
                {children}
                </div>
                <Footer />
                <ToastProvider />
          </MathJaxProvider>
        </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
