
import { createClient } from '@supabase/supabase-js';

// Hardcoding keys here to ensure script runs standalone without path alias issues for now
// (copied from src/integrations/supabase/client.ts)
const SUPABASE_URL = "https://rjvgdqcbvikmjlrtraap.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkDb() {
    console.log("Checking connection to Supabase...");
    console.log("Querying 'pages' table...");

    const { count, error } = await supabase
        .from('pages')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("❌ Error accessing 'pages' table:", error.message);
        if (error.code === '42P01') {
            console.error("   (Code 42P01 usually means the table does not exist)");
        }
        process.exit(1);
    }

    console.log(`✅ Success! The 'pages' table exists.`);
    console.log(`   Current row count: ${count}`);
}

checkDb();
