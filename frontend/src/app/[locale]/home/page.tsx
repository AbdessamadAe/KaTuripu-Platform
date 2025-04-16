import Hero from "@/components/client/Hero";
import { useLocale } from "next-intl";

export default function HomePage() {
    const locale = useLocale();
    return (
        <div>
            <Hero locale={locale}/>
        </div>
    );
}
