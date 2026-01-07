const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = "https://rjvgdqcbvikmjlrtraap.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU";
const APP_DIR = path.join(__dirname, 'src', 'app');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function findPages(dir, fileList = []) {
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

// Helper to deduce category
function deduceCategory(slug) {
    if (slug.includes('haartransplantatie')) return 'Haartransplantatie';
    if (slug.includes('v6-hairboost')) return 'V6 Hairboost';
    if (slug.includes('review')) return 'Algemeen';
    return 'Other';
}

async function runSync() {
    console.log('--- STARTING PAGE SYNC ---');

    // 1. Find all page.tsx files
    const allPageFiles = findPages(APP_DIR);
    console.log(`Found ${allPageFiles.length} page.tsx files.`);

    const pagesToUpsert = [];

    // 2. Process each file into potential slugs
    allPageFiles.forEach(absolutePath => {
        // Get relative path from src/app
        // e.g. [lang]\v6-hairboost\(methods)\reborn\page.tsx
        let relative = path.relative(APP_DIR, absolutePath);

        // Remove 'page.tsx'
        let dirPath = path.dirname(relative); // [lang]\v6-hairboost\(methods)\reborn

        // Normalize slashes
        dirPath = dirPath.split(path.sep).join('/');

        // Helper to generate slug for a specific language
        const generateMockSlug = (langCode) => {
            // Replace [lang] with actual code
            let slug = dirPath.replace('[lang]', langCode);

            // Remove group folders (e.g. (methods), (protected))
            const parts = slug.split('/');
            const cleanParts = parts.filter(p => !p.startsWith('(') && !p.endsWith(')'));
            slug = cleanParts.join('/');

            // Handle root [lang] page which becomes just "nl" or "en"
            if (slug === '') return langCode;

            return slug;
        };

        // We support NL and EN
        ['nl', 'en'].forEach(lang => {
            const finalSlug = generateMockSlug(lang);

            // Skip admin pages or api routes if any slipped in (though we scanned src/app)
            if (finalSlug.includes('admin')) return;

            // Construct Record
            const category = deduceCategory(finalSlug);

            pagesToUpsert.push({
                slug: finalSlug,
                language: lang,
                category: category,
                status: 'published',
                seo_title: null,
                updated_at: new Date().toISOString()
            });
        });
    });

    console.log(`Prepared ${pagesToUpsert.length} potential pages (NL + EN).`);

    // Fetch all existing slugs
    const { data: existingPages, error: fetchError } = await supabase.from('pages').select('slug');
    if (fetchError) {
        console.error('Error fetching existing pages:', fetchError);
        return;
    }

    const existingSlugSet = new Set(existingPages.map(p => p.slug));
    const newPages = pagesToUpsert.filter(p => !existingSlugSet.has(p.slug));

    if (newPages.length === 0) {
        console.log('No new pages to insert. Database is in sync.');
        return;
    }

    console.log(`Found ${newPages.length} NEW pages. Generating SQL...`);

    const sqlStatements = newPages.map(p => {
        // Escape single quotes in slugs if any (unlikely for slugs but good practice)
        const safeSlug = p.slug.replace(/'/g, "''");
        return `INSERT INTO public.pages (slug, language, category, status, updated_at) VALUES ('${safeSlug}', '${p.language}', '${p.category}', 'published', NOW()) ON CONFLICT (slug) DO NOTHING;`;
    }).join('\n');

    const outputPath = path.join(__dirname, 'sync-missing-pages.sql');
    fs.writeFileSync(outputPath, sqlStatements);

    console.log(`Success! SQL generated at: ${outputPath}`);
    console.log('--- SYNC COMPLETE ---');
}

runSync();
