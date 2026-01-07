const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://rjvgdqcbvikmjlrtraap.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkPages() {
    console.log('--- DIAGNOSTIC: Slug Mismatch Check ---');

    // 1. Check the LIVE page slug
    const { data: livePage } = await supabase
        .from('pages')
        .select('id, slug, seo_title, page_title, meta_description, updated_at')
        .eq('slug', 'nl/contact')
        .maybeSingle();

    console.log('\n[LIVE PAGE] (slug: nl/contact)');
    if (livePage) {
        console.log(JSON.stringify(livePage, null, 2));
    } else {
        console.log('NOT FOUND');
    }

    // 2. Check the GHOST page slug
    const { data: ghostPage } = await supabase
        .from('pages')
        .select('id, slug, seo_title, page_title, meta_description, updated_at')
        .eq('slug', 'contact')
        .maybeSingle();

    console.log('\n[GHOST PAGE] (slug: contact)');
    if (ghostPage) {
        console.log(JSON.stringify(ghostPage, null, 2));
    } else {
        console.log('NOT FOUND');
    }
}

checkPages();
