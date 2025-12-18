import { Metadata } from 'next';
import { PackageStandardPage } from "@/components/PackageStandardPage";
import { getPackageSEO, Country, Tier, Language } from '@/lib/package-seo';

interface Props {
    params: Promise<{
        lang: string;
        country: string;
        tier: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { country, tier, lang } = await params;

    const seoData = getPackageSEO(
        country as Country,
        tier as Tier,
        lang as Language
    );

    return {
        title: seoData.title,
        description: seoData.description,
    };
}

export default function Page() {
    return <PackageStandardPage />;
}
