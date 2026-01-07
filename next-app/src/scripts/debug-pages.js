
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://rjvgdqcbvikmjlrtraap.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function listPages() {
    const { data, error } = await supabase
        .from('pages')
        .select('slug, page_title, status')
        .ilike('slug', '%test%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Found Pages:', data);
}

listPages();
