
import { HaartransplantatieLayout } from '@/components/haartransplantatie/HaartransplantatieLayout';
import TreatmentsPage from '@/components/TreatmentsPage';
// import { ClientHomePage } from '@/components/ClientHomePage'; // Preserved for future use

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
