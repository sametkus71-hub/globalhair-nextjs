import { notFound } from 'next/navigation';
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';
import { getComponentForSlug } from '@/lib/page-registry';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        lang: string;
        slug: string[];
    }>;
}

/**
 * 1. SEO Generation
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const slugPath = [params.lang, ...params.slug].join('/');
    const pageData = await getPageBySlug(slugPath);

    return generatePageMetadata(pageData);
}

/**
 * 2. Page Rendering
 */
export default async function DynamicPage(props: Props) {
    const params = await props.params;

    console.log("[DynamicPage] Request:", { lang: params.lang, slug: params.slug });
    const slugPath = [params.lang, ...params.slug].join('/');
    console.log("[DynamicPage] Looking up slug:", slugPath);

    // 1. Fetch Data
    const pageData = await getPageBySlug(slugPath);
    console.log("[DynamicPage] DB Result:", pageData ? "Found" : "Not Found");

    // 2. Resolve Component
    const Component = getComponentForSlug(slugPath);

    // 3. Fallback / 404
    if (!Component && !pageData) {
        console.log("[DynamicPage] No component AND no data -> 404");
        notFound();
    }

    if (!Component) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">{pageData?.page_title || "Untitled Page"}</h1>
                <p>This page exists in the database but has no template assigned.</p>
                <div className="mt-4 p-4 bg-gray-100 inline-block rounded text-left text-sm">
                    <p><strong>Slug:</strong> {slugPath}</p>
                    <p><strong>SEO Title:</strong> {pageData?.seo_title}</p>
                </div>
            </div>
        );
    }

    return <Component />;
}
