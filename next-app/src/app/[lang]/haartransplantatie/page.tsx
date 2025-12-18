import type { Metadata } from 'next';
import TreatmentsPage from '@/components/TreatmentsPage';

export const metadata: Metadata = {
    title: 'Haartransplantatie Behandelingen | GlobalHair Institute',
    description: 'Bekijk onze haartransplantatie behandelingen. Premium FUE haartransplantatie in Nederland en Turkije met V6 Hairboost® technologie.',
};

export default function Page() {
    return <TreatmentsPage />;
}
