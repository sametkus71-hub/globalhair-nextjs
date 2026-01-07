import { getPageBySlug, generatePageMetadata } from '@/lib/seo';
import { BookingPage } from "@/components/BookingPage";
import { HaartransplantatieLayout } from "@/components/haartransplantatie/HaartransplantatieLayout";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const slug = `${lang}/boek`;
    const pageData = await getPageBySlug(slug);
    return generatePageMetadata(pageData);
}

export default function Page() {
    return (
        <HaartransplantatieLayout>
            <BookingPage />
        </HaartransplantatieLayout>
    );
}
