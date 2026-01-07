import { getPageBySlug, generatePageMetadata } from '@/lib/seo';
import TreatmentsPage from '@/components/TreatmentsPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const slug = `${lang}/haartransplantatie`;
    const pageData = await getPageBySlug(slug);
    return generatePageMetadata(pageData);
}

export default function Page() {
    return <TreatmentsPage />;
}
