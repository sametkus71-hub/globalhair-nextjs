import ContactPage from "@/components/ContactPage";
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

type Props = {
    params: { lang: string };
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const slug = `${lang}/contact`;
    const page = await getPageBySlug(slug);

    const meta = await generatePageMetadata(page);
    return meta;
}

export default function Page() {
    return <ContactPage />;
}
