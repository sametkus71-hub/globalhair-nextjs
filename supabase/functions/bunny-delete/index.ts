import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Bunny-delete function called');

  try {
    // Verify user is authenticated and is admin
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!roleData || roleData.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get path from request body
    const { path } = await req.json();

    if (!path) {
      return new Response(JSON.stringify({ error: 'No path provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Bunny CDN credentials
    const apiKey = Deno.env.get('BUNNY_STORAGE_API_KEY');
    const region = Deno.env.get('BUNNY_STORAGE_REGION') || 'uk';
    const zone = Deno.env.get('BUNNY_STORAGE_ZONE');

    if (!apiKey || !zone) {
      console.error('Missing Bunny CDN credentials');
      return new Response(JSON.stringify({ error: 'Storage configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Deleting file: ${path}`);

    // Delete from Bunny CDN
    const deleteUrl = `https://${region}.storage.bunnycdn.com/${zone}/${path}`;
    
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'AccessKey': apiKey,
      },
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('Bunny CDN delete failed:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to delete file', details: errorText }), {
        status: deleteResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`File deleted successfully: ${path}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'File deleted successfully',
      path: path,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in bunny-delete:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
