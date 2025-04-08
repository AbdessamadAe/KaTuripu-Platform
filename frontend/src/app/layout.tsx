import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MathJaxProvider from "@/components/MathJaxProvider";
import { GamificationProvider } from "@/contexts/GamificationContext";
import BadgeNotification from "@/components/gamification/BadgeNotification";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "KaTuripu",
  description: "KaTuripu - Roadmaps",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <GamificationProvider>
            <MathJaxProvider>
              {children}
              <BadgeNotification />
            </MathJaxProvider>
          </GamificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
