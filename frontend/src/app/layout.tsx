import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MathJaxProvider from "@/components/MathJaxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import Nav from "@/components/client/Nav";
import ToastProvider from "@/components/client/ToastProvider";
import Footer from "@/components/client/Footer";

export const metadata: Metadata = {
  title: "KaTuripu",
  description: "KaTuripu - Roadmaps",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased min-h-screen w-full overflow-x-hidden`}>
        <MathJaxProvider>
          <AuthProvider>
            <ProgressProvider>
              <Nav />
              {children}
              <Footer />
              <ToastProvider />
            </ProgressProvider>
          </AuthProvider>
        </MathJaxProvider>
      </body>
    </html>
  );
}
