import HaartransplantatieContactPage from "@/components/HaartransplantatieContactPage";
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const slug = `${lang}/haartransplantatie/contact`;
    const pageData = await getPageBySlug(slug);
    return generatePageMetadata(pageData);
}

export default function Page() {
    return <HaartransplantatieContactPage />;
}
