import type { Metadata } from 'next';
import TreatmentsPage from '@/components/TreatmentsPage';

export const metadata: Metadata = {
    title: 'GlobalHair Institute - Specialist in élk haartype & haarprobleem',
    description: 'Bereik het beste resultaat met onze unieke GHI Stemcell repair™ en V6 Hairboost®. Wij zijn gespecialiseerd in oplossingen voor elk haartype en elk haarprobleem.',
};

export default function Page() {
    return <TreatmentsPage />;
}
