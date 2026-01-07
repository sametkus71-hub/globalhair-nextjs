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
    return 'Uncategorized';
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

        const supabaseKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

        if (!supabaseKey) {
            throw new Error("Supabase Key is required");
        }

        // Options to pass user session if available (for RLS)
        const options: any = {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            }
        };

        // If we don't have the Service Role Key, try to use the User's Token
        if (!supabaseServiceKey) {
            const authHeader = request.headers.get('Authorization');
            if (authHeader) {
                options.global = {
                    headers: {
                        Authorization: authHeader,
                    },
                };
            }
        }

        const supabase = createClient(supabaseUrl, supabaseKey, options);

        // 2. Scan Filesystem
        const appDir = path.join(process.cwd(), 'src', 'app');
        const allPageFiles = findPages(appDir);

        const pagesToUpsert: any[] = [];
        const processedSlugs = new Set<string>(); // Keep track to prevent duplicates in the batch

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

                // Deduplicate check
                const uniqueKey = `${lang}:${finalSlug.toLowerCase()}`;
                if (processedSlugs.has(uniqueKey)) return;
                processedSlugs.add(uniqueKey);

                // Derive component_key from the directory structure (stable)
                // e.g. "src/app/[lang]/v6-hairboost" -> "v6-hairboost"
                const componentKey = dirPath.replace('[lang]/', '').replace('[lang]', '').replace(/^\//, '');

                pagesToUpsert.push({
                    slug: finalSlug, // Default slug (can be changed in DB later)
                    component_key: componentKey, // Stable link to code
                    language: lang,
                    category: deduceCategory(finalSlug),
                    status: 'published',
                    updated_at: new Date().toISOString()
                });
            });
        });

        // 4. Smart Upsert Logic
        // We want to:
        // A. Assign keys to existing pages if they match the default slug (Legacy migration)
        // B. Insert new pages that don't exist at all.
        // C. NOT overwrite custom slugs or titles of existing pages.

        const { data: existingPages } = await supabase.from('pages').select('id, slug, component_key, language');

        // Map existing pages for quick lookup (Normalize to lowercase to prevent duplicates)
        const slugMap = new Map();
        existingPages?.forEach((p: any) => slugMap.set(`${p.language}:${p.slug.toLowerCase()}`, p));

        const keyMap = new Map();
        existingPages?.forEach((p: any) => {
            if (p.component_key) keyMap.set(`${p.language}:${p.component_key}`, p);
        });

        const updates = [];
        const inserts = [];

        for (const page of pagesToUpsert) {
            const pageSlugLower = page.slug.toLowerCase();
            const langKey = `${page.language}:${page.component_key}`;
            const slugKey = `${page.language}:${pageSlugLower}`;

            // Case 1: Page exists by Key (Perfect match)
            if (keyMap.has(langKey)) {
                continue;
            }

            // Case 2: Page exists by Exact Slug Match but has NO Key (Legacy migration)
            if (slugMap.has(slugKey)) {
                const existing = slugMap.get(slugKey);

                // Only update if missing key
                if (!existing.component_key) {
                    updates.push({
                        id: existing.id,
                        slug: existing.slug, // Keep original slug casing
                        component_key: page.component_key,
                        updated_at: new Date().toISOString()
                    });
                }
                continue;
            }

            // Case 2b: Fuzzy Match (e.g. DB has 'chat', generated is 'nl/chat')
            // Try stripping the language prefix
            const shortSlug = pageSlugLower.replace(`${page.language}/`, '');
            const shortSlugKey = `${page.language}:${shortSlug}`;

            if (slugMap.has(shortSlugKey)) {
                const existing = slugMap.get(shortSlugKey);
                if (!existing.component_key) {
                    updates.push({
                        id: existing.id,
                        slug: existing.slug,
                        component_key: page.component_key,
                        updated_at: new Date().toISOString()
                    });
                }
                continue;
            }

            // Case 3: Totally new -> Insert
            inserts.push(page);
        }

        if (updates.length > 0) {
            console.log("Attempting to UPDATE keys for:", updates.map(u => u.slug));
            // Upserting by ID is safe
            const { error } = await supabase.from('pages').upsert(updates);
            if (error) {
                console.error("Error updating legacy keys:", error);
                throw error;
            }
        }

        if (inserts.length > 0) {
            console.log("Attempting to INSERT new pages:", inserts.map(p => p.slug));
            // Insert new pages using safe upsert to ignore conflicts if any slipped through
            const { error } = await supabase.from('pages').upsert(inserts, {
                onConflict: 'slug',
                ignoreDuplicates: true
            });
            if (error) throw error;
        }

        return NextResponse.json({
            success: true,
            message: `Synced: ${inserts.length} new (${inserts.map(i => i.slug).join(', ')}), ${updates.length} updated (${updates.map(u => u.component_key).join(', ')}).`,
            totalScanned: pagesToUpsert.length,
            newPages: inserts.map(p => p.slug)
        });

    } catch (error: any) {
        console.error('Sync Error:', error);
        try {
            const fs = require('fs');
            const path = require('path');
            fs.writeFileSync(path.join(process.cwd(), 'sync-error.log'), `Error: ${error.message}\nStack: ${error.stack}\n`);
        } catch (e) {
            // ignore logging error
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
