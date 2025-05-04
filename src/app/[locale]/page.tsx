"use client";

import Hero from "@/components/Hero";
import { useLocale } from "next-intl";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";

export default function Home() {
    const locale = useLocale();
    return (
        <div>
            <Hero locale={locale}/>
            <Features/>
            <Testimonials/>
        </div>
    );
}
