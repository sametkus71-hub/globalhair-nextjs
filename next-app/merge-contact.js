const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://rjvgdqcbvikmjlrtraap.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function mergePages() {
    console.log('--- Merging Ghost Page (contact) into Live Page (nl/contact) ---');

    const ghostSlug = 'contact';
    const liveSlug = 'nl/contact';

    // 1. Get Ghost Data
    const { data: ghost } = await supabase.from('pages').select('*').eq('slug', ghostSlug).single();
    if (!ghost) {
        console.log('Ghost page not found. Already deleted?');
        return;
    }
    console.log(`Found Ghost Page: "${ghost.seo_title}" (ID: ${ghost.id})`);

    // 2. Get Live Data
    const { data: live } = await supabase.from('pages').select('*').eq('slug', liveSlug).single();
    if (!live) {
        console.log('Live page not found. Critical error.');
        return;
    }
    console.log(`Found Live Page: "${live.seo_title}" (ID: ${live.id})`);

    // 3. Update Live Page with Ghost Data
    const { error: updateError } = await supabase
        .from('pages')
        .update({
            seo_title: ghost.seo_title,             // "pagetitlecontact"
            page_title: ghost.page_title,           // "Contact"
            meta_description: ghost.meta_description, // "empty" (or whatever user typed)
            og_title: ghost.og_title,
            og_description: ghost.og_description,
            og_image: ghost.og_image,
            // Keep status and content of Live page usually, but user seems to want metadata override
            updated_at: new Date().toISOString()
        })
        .eq('id', live.id);

    if (updateError) {
        console.error('Failed to update live page:', updateError);
        return;
    }
    console.log('SUCCESS: Live Page updated with Ghost metadata.');

    // 4. Delete Ghost Page
    const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .eq('id', ghost.id);

    if (deleteError) {
        console.error('Failed to delete ghost page:', deleteError);
    } else {
        console.log('SUCCESS: Ghost Page deleted.');
    }
}

mergePages();
