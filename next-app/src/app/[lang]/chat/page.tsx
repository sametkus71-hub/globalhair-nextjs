import ChatPage from "@/components/ChatPage";
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const slug = `${lang}/chat`;
    const pageData = await getPageBySlug(slug);
    return generatePageMetadata(pageData);
}

export default function Page() {
    return <ChatPage />;
}
