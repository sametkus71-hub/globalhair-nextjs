import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import { Database } from '@/integrations/supabase/types';

// SERVER-SIDE CLIENT
// We create a new client here because importing from '@/integrations/supabase/client' 
// fails in Server Components due to "use client" directive.

const SUPABASE_URL = "https://rjvgdqcbvikmjlrtraap.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        persistSession: false, // No session needed for server-side public fetching
    }
});

export type PageData = {
    id: string;
    parent_id: string | null;
    slug: string;
    language: string;
    seo_title: string | null;
    page_title: string | null;
    meta_description: string | null;
    category: string;
    status: string;
    is_in_sitemap: boolean;
    content: any;
    // Social Fields
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
};

type SiteSettings = {
    site_name: string;
    default_meta_description: string;
    default_og_image: string;
};

// Default Hardcoded Fallbacks (Safety Net)
const DEFAULTS = {
    SITE_NAME: 'GlobalHair Institute',
    DESCRIPTION: 'GlobalHair Institute is de specialist in haartransplantaties en haarverbetering.',
    IMAGE: 'https://GlobalHair.b-cdn.net/globalhair%20favicon4.png'
};

/**
 * Fetches page data from Supabase by slug.
 */
export async function getPageBySlug(slug: string): Promise<PageData | null> {
    try {
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .maybeSingle();

        if (error) {
            console.error(`[seo.ts] Error fetching page ${slug}:`, error);
            return null;
        }

        return data as PageData | null;
    } catch (e) {
        console.error(`Exception fetching page ${slug}:`, e);
        return null;
    }
}

/**
 * Fetches global site settings (Singleton).
 */
async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const { data } = await supabase
            .from('site_settings')
            .select('*')
            .single();

        if (data) {
            return {
                site_name: data.site_name,
                default_meta_description: data.default_meta_description,
                default_og_image: data.default_og_image,
            };
        }
    } catch (e) {
        // Fallback to defaults
    }
    return {
        site_name: DEFAULTS.SITE_NAME,
        default_meta_description: DEFAULTS.DESCRIPTION,
        default_og_image: DEFAULTS.IMAGE,
    };
}

/**
 * Recursive Waterfall Logic for finding the best Social Image.
 * 1. Page specific image
 * 2. Parent's image (recursive)
 * 3. Global Default
 */
async function resolveSocialImage(page: PageData | null, globalDefault: string): Promise<string> {
    if (!page) return globalDefault;

    // 1. Direct match
    if (page.og_image) return page.og_image;

    // 2. Parent lookup (One level up only for performance, or max 3 levels)
    // We implement a loop to traverse up.
    let currentParentId = page.parent_id;
    let depth = 0;
    const MAX_DEPTH = 3;

    while (currentParentId && depth < MAX_DEPTH) {
        const { data: parent } = await supabase
            .from('pages')
            .select('id, parent_id, og_image')
            .eq('id', currentParentId)
            .single();

        if (parent?.og_image) {
            return parent.og_image; // Found inherited image
        }

        currentParentId = parent?.parent_id || null;
        depth++;
    }

    // 3. Global Default
    return globalDefault;
}

/**
 * Generates Next.js Metadata object from PageData.
 * Now Async to support DB lookups.
 */
export async function generatePageMetadata(page: PageData | null): Promise<Metadata> {
    // 1. Fetch Global Settings in parallel (usually fast)
    const settings = await getSiteSettings();

    // 2. Resolve final values
    // 2. Resolve final values
    const rawTitle = page?.og_title || page?.seo_title || page?.page_title || settings.site_name;
    const description = page?.og_description || page?.meta_description || settings.default_meta_description;

    // Append Site Name if not present (to override layout.tsx template)
    let finalTitle = rawTitle;

    // Clean legacy suffix (Crucial Fix for Double Titles)
    const LEGACY_SUFFIX = ' | GlobalHair Institute';
    if (finalTitle && finalTitle.endsWith(LEGACY_SUFFIX)) {
        finalTitle = finalTitle.substring(0, finalTitle.length - LEGACY_SUFFIX.length);
    }

    if (finalTitle && !finalTitle.includes(settings.site_name) && finalTitle !== settings.site_name) {
        finalTitle = `${finalTitle} | ${settings.site_name}`;
    }

    // 3. Resolve Image (Waterfall)
    const ogImage = await resolveSocialImage(page, settings.default_og_image);

    return {
        title: {
            absolute: finalTitle, // Forces Next.js to ignore the parent template
        },
        description: description,
        openGraph: {
            title: finalTitle,
            description: description,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: finalTitle,
                },
            ],
            type: 'website',
            siteName: settings.site_name,
        },
        twitter: {
            card: 'summary_large_image',
            title: finalTitle,
            description: description,
            images: [ogImage],
        },
    };
}
