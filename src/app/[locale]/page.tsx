"use client";

import Hero from "@/components/home/Hero";
import { useLocale } from "next-intl";
import Footer from "@/components/Footer";

export default function Home() {
    const locale = useLocale();
    return (
        <div className=" bg-gradient-to-b from-white to-[var(--primary-color-light)]/20 dark:from-gray-900 dark:to-indigo-900/30">
            <Hero locale={locale}/>
            <Footer />
        </div>
    );
}
