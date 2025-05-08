"use client";

import Hero from "@/components/home/Hero";
import { useLocale } from "next-intl";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";

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
