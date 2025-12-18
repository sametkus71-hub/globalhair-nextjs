import { Metadata } from 'next';
import { PackageStandardPage } from "@/components/PackageStandardPage";
import { getPackageSEO, Country, Tier, Language } from '@/lib/package-seo';

interface Props {
    params: {
        lang: string;
        country: string;
        tier: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const seoData = getPackageSEO(
        params.country as Country,
        params.tier as Tier,
        params.lang as Language
    );

    return {
        title: seoData.title,
        description: seoData.description,
    };
}

export default function Page() {
    return <PackageStandardPage />;
}
