import Hero from "@/components/home/Hero";
import { useLocale } from "next-intl";

export default function HomePage() {
    const locale = useLocale();
    return (
        <div>
            <Hero locale={locale}/>
        </div>
    );
}
