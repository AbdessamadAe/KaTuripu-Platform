import Hero from "@/components/Hero";
import { useLocale } from "next-intl";
import Features from "@/components/Features";

export default function HomePage() {
    const locale = useLocale();
    return (
        <div>
            <Hero locale={locale}/>
            <Features/>
        </div>
    );
}
