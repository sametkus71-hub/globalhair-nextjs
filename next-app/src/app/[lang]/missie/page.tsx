import MissionPage from "@/components/MissionPage";
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const slug = `${lang}/missie`;
    const pageData = await getPageBySlug(slug);
    return generatePageMetadata(pageData);
}

export default function Page() {
    return <MissionPage />;
}
