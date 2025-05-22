"use client";

import Hero from "@/components/home/Hero";
import { useLocale } from "next-intl";

export default function Home() {
    const locale = useLocale();
    return (
        <div>
            <Hero locale={locale}/>
        </div>
    );
}
