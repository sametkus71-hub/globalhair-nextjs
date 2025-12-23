
import { BookingSuccessPage } from '@/components/BookingSuccessPage';

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
