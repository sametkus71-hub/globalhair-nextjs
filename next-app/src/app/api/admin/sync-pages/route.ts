import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase Admin Client (Service Role)
// We need this to bypass RLS for insertions if the user isn't fully authenticated as a specific role that allows inserts
// However, since we are in an API route, we should verify the user's session first from the request headers
// For now, assuming this is a protected route or we rely on the session passed. 
// Actually, file system access requires Node runtime.

export const runtime = 'nodejs'; // Enforce Node.js runtime for FS access

// Helper to deduce category
function deduceCategory(slug: string) {
    if (slug.includes('haartransplantatie')) return 'Haartransplantatie';
    if (slug.includes('v6-hairboost')) return 'V6 Hairboost';
    if (slug.includes('review')) return 'Algemeen';
    return 'Other';
}

function findPages(dir: string, fileList: string[] = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findPages(filePath, fileList);
        } else if (file === 'page.tsx') {
            fileList.push(filePath);
        }
    });
    return fileList;
}

export async function POST(request: Request) {
    try {
        // 1. Verify Authentication (Basic Check)
        // In a real app, check cookies/session here. 
        // For local dev/admin, we proceed.

        // Hardcoded fallbacks for local dev reliability
        const FALLBACK_URL = "https://rjvgdqcbvikmjlrtraap.supabase.co";
        const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU";

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        // Use service key if available, otherwise anon key, otherwise fallback
        const supabaseKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

        if (!supabaseKey) {
            throw new Error("Supabase Key is required");
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // 2. Scan Filesystem
        const appDir = path.join(process.cwd(), 'src', 'app');
        const allPageFiles = findPages(appDir);

        const pagesToUpsert: any[] = [];

        // 3. Process each file
        allPageFiles.forEach(absolutePath => {
            let relative = path.relative(appDir, absolutePath);
            let dirPath = path.dirname(relative).split(path.sep).join('/');

            const generateMockSlug = (langCode: string) => {
                let slug = dirPath.replace('[lang]', langCode);
                const parts = slug.split('/');
                const cleanParts = parts.filter(p => !p.startsWith('(') && !p.endsWith(')'));
                slug = cleanParts.join('/');
                if (slug === '') return langCode;
                return slug;
            };

            ['nl', 'en'].forEach(lang => {
                const finalSlug = generateMockSlug(lang);
                if (finalSlug.includes('admin') || finalSlug.includes('api')) return;

                pagesToUpsert.push({
                    slug: finalSlug,
                    language: lang,
                    category: deduceCategory(finalSlug),
                    status: 'published',
                    // seo_title: null, // Let DB default or preserve existing
                    updated_at: new Date().toISOString()
                });
            });
        });

        // 4. Upsert Logic (Manual "ON CONFLICT DO NOTHING" simulation or real upsert)
        // We want to add MISSING pages, not overwrite existing ones (to keep custom titles).
        // Best approach: Fetch all, filter new, insert new.

        const { data: existingPages } = await supabase.from('pages').select('slug');
        const existingSlugSet = new Set((existingPages || []).map((p: any) => p.slug));

        const newPages = pagesToUpsert.filter(p => !existingSlugSet.has(p.slug));

        if (newPages.length > 0) {
            // Using upsert with ignoreDuplicates to prevent unique constraint errors
            // We only want to add missing pages, NOT update existing ones blindly
            const { error } = await supabase.from('pages').upsert(newPages, {
                onConflict: 'slug',
                ignoreDuplicates: true
            });
            if (error) throw error;
        }

        return NextResponse.json({
            success: true,
            message: `Synced ${newPages.length} new pages.`,
            totalScanned: pagesToUpsert.length,
            newPages: newPages.map(p => p.slug)
        });

    } catch (error: any) {
        console.error('Sync Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
