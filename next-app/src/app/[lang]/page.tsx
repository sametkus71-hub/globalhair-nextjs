
import type { Metadata } from 'next';
import { HaartransplantatieLayout } from '@/components/haartransplantatie/HaartransplantatieLayout';
import TreatmentsPage from '@/components/TreatmentsPage';
import { ClientHomePage } from '@/components/ClientHomePage'; // Preserved for future use

import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const slug = lang;
    const pageData = await getPageBySlug(slug);
    return generatePageMetadata(pageData);
}

export default async function LangPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <HaartransplantatieLayout>
            <TreatmentsPage />
        </HaartransplantatieLayout>
    );
}

export function generateStaticParams() {
    return [{ lang: 'nl' }, { lang: 'en' }];
}
