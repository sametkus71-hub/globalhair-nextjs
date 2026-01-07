import { notFound } from 'next/navigation';
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';
import { getComponentForKey } from '@/lib/page-registry';
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
    const pageData = await getPageBySlug(slugPath);

    // 1. Check if page exists in DB
    if (!pageData) {
        console.log("[DynamicPage] Page not found in DB:", slugPath);
        return notFound();
    }

    console.log("[DynamicPage] Found Page:", { id: pageData.id, key: pageData.component_key });

    // 2. Resolve Component using Key
    const Component = getComponentForKey(pageData.component_key);

    // 3. Render
    if (!Component) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">{pageData?.page_title || "Untitled Page"}</h1>
                <p className="text-gray-500 mb-4">This page is managed in the database.</p>
                <div className="inline-block p-4 bg-yellow-50 border border-yellow-200 rounded text-left text-sm text-yellow-800">
                    <p className="font-bold mb-2">⚠️ No Component Mapped</p>
                    <p><strong>DB Component Key:</strong> <code>{pageData.component_key || "(Empty)"}</code></p>
                    <p className="mt-2">
                        To fix this:
                        <ol className="list-decimal ml-4 mt-1">
                            <li>Check <code>src/lib/page-registry.tsx</code></li>
                            <li>Ensure key <code>{pageData.component_key}</code> is mapped to a file.</li>
                        </ol>
                    </p>
                </div>
            </div>
        );
    }

    return <Component params={props.params} />;
}
