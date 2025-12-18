
import type { Metadata } from 'next';
import { HaartransplantatieLayout } from '@/components/haartransplantatie/HaartransplantatieLayout';
import TreatmentsPage from '@/components/TreatmentsPage';
import { ClientHomePage } from '@/components/ClientHomePage'; // Preserved for future use

export const metadata: Metadata = {
    title: 'GlobalHair Institute - Specialist in élk haartype & haarprobleem',
    description: 'Bereik het beste resultaat met onze unieke GHI Stemcell repair™ en V6 Hairboost®. Wij zijn gespecialiseerd in oplossingen voor elk haartype en elk haarprobleem.',
    openGraph: {
        title: 'GlobalHair Institute - Premium Haartransplantatie',
        description: 'Premium FUE haartransplantatie met GHI Stemcell Repair™ voor 20-35% meer dichtheid.',
        type: 'website',
    },
};

export default async function LangPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <HaartransplantatieLayout>
            <TreatmentsPage />
        </HaartransplantatieLayout>
    );
}

export function generateStaticParams() {
    return [{ lang: 'nl' }, { lang: 'en' }];
}
