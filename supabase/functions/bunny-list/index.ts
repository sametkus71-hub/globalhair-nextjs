import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const BASE_FOLDER = 'website-storage';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Bunny-list function called');

  try {
    // Extract user ID from JWT (already validated by Supabase)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    let userId: string;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub;
      console.log('User ID from JWT:', userId);
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role to check admin status
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (roleError) {
      console.error('Role check error:', roleError);
      return new Response(JSON.stringify({ error: 'Failed to verify admin role' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!roleData || roleData.role !== 'admin') {
      console.log('User role:', roleData?.role);
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get path from query params
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '';
    const fullPath = path ? `${BASE_FOLDER}/${path}` : BASE_FOLDER;

    // Get Bunny CDN credentials
    const apiKey = Deno.env.get('BUNNY_STORAGE_API_KEY');
    const region = Deno.env.get('BUNNY_STORAGE_REGION') || 'uk';
    const zone = Deno.env.get('BUNNY_STORAGE_ZONE');
    const cdnHostname = Deno.env.get('BUNNY_CDN_HOSTNAME');

    if (!apiKey || !zone || !cdnHostname) {
      console.error('Missing Bunny CDN credentials');
      return new Response(JSON.stringify({ error: 'Storage configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Listing files in: ${fullPath}`);
    console.log(`Zone: ${zone}`);
    console.log(`API Key length: ${apiKey.length} characters`);
    console.log(`API Key first 10 chars: ${apiKey.substring(0, 10)}...`);

    // List files from Bunny CDN
    const listUrl = `https://${region}.storage.bunnycdn.com/${zone}/${fullPath}/`;
    
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'AccessKey': apiKey,
        'accept': 'application/json',
      },
    });

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('Bunny CDN list failed:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to list files', details: errorText }), {
        status: listResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const files = await listResponse.json();
    
    // Transform the response to include full URLs
    const transformedFiles = files.map((file: any) => ({
      name: file.ObjectName,
      path: path ? `${path}/${file.ObjectName}` : file.ObjectName,
      url: path 
        ? `https://${cdnHostname}/${path}/${file.ObjectName}`
        : `https://${cdnHostname}/${file.ObjectName}`,
      size: file.Length,
      lastModified: file.LastChanged,
      isDirectory: file.IsDirectory,
    }));

    console.log(`Found ${transformedFiles.length} files`);

    return new Response(JSON.stringify({
      success: true,
      files: transformedFiles,
      path: path,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in bunny-list:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
