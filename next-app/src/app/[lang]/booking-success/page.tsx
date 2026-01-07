
import { BookingSuccessPage } from '@/components/BookingSuccessPage';
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const slug = `${lang}/booking-success`;
    const pageData = await getPageBySlug(slug);
    return generatePageMetadata(pageData);
}

// Force dynamic rendering to handle search params
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        lang: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    // Await params for Next.js 15+ compatibility
    const { lang } = await params;

    return <BookingSuccessPage />;
}
