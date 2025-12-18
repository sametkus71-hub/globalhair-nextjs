
import type { Metadata } from 'next';
import { HaartransplantatieLayout } from '@/components/haartransplantatie/HaartransplantatieLayout';
import TreatmentsPage from '@/components/TreatmentsPage';
import { ClientHomePage } from '@/components/ClientHomePage'; // Preserved for future use

export const metadata: Metadata = {
    title: 'GlobalHair Institute - Premium Haartransplantatie Nederland',
    description: 'Ontdek premium haartransplantatie bij GlobalHair Institute. FUE Saffier methode, GHI Stemcell Repair™ en V6 Hairboost® technologie. Kliniek in Nederland.',
    openGraph: {
        title: 'GlobalHair Institute - Premium Haartransplantatie',
        description: 'Premium FUE haartransplantatie met GHI Stemcell Repair™ voor 20-35% meer dichtheid.',
        type: 'website',
    },
};

export default function LangPage({ params }: { params: { lang: string } }) {
    return (
        <HaartransplantatieLayout>
            <TreatmentsPage />
        </HaartransplantatieLayout>
    );
}

export function generateStaticParams() {
    return [{ lang: 'nl' }, { lang: 'en' }];
}
