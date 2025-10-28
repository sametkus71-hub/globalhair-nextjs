// Zoho OAuth and API utilities
import { createClient } from 'npm:@supabase/supabase-js@2';

interface ZohoTokenResponse {
  access_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
}

/**
 * Get a valid Zoho access token (stored in Supabase for persistence)
 */
export async function getZohoAccessToken(): Promise<string> {
  // Initialize Supabase client with service role
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check if we have a valid token in the database
  const { data: tokenData, error: fetchError } = await supabase
    .from('zoho_tokens')
    .select('access_token, expires_at')
    .eq('id', 'zoho_oauth')
    .single();

  if (!fetchError && tokenData) {
    const expiresAt = new Date(tokenData.expires_at).getTime();
    const now = Date.now();
    
    // Return cached token if still valid (more than 5 minutes remaining)
    if (now < expiresAt - 5 * 60 * 1000) {
      console.log('Using cached Zoho token from database');
      return tokenData.access_token;
    }
  }

  console.log('Refreshing Zoho access token...');

  // Get OAuth credentials from environment
  const clientId = Deno.env.get('ZB_CLIENT_ID');
  const clientSecret = Deno.env.get('ZB_CLIENT_SECRET');
  const refreshToken = Deno.env.get('ZB_REFRESH_TOKEN');
  const accountsBase = Deno.env.get('ZB_ACCOUNTS_BASE') || 'https://accounts.zoho.com';

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Zoho OAuth credentials');
  }

  // Request new access token
  const tokenUrl = `${accountsBase}/oauth/v2/token`;
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  });

  const response = await fetch(`${tokenUrl}?${params.toString()}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh Zoho token: ${error}`);
  }

  const data: ZohoTokenResponse = await response.json();

  // Store token in database with expiry (55 minutes from now)
  const expiresAt = new Date(Date.now() + 55 * 60 * 1000).toISOString();
  
  const { error: updateError } = await supabase
    .from('zoho_tokens')
    .upsert({
      id: 'zoho_oauth',
      access_token: data.access_token,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Failed to store token in database:', updateError);
    // Continue anyway - token refresh succeeded
  } else {
    console.log('Token refreshed and stored in database');
  }

  return data.access_token;
}

/**
 * Make an authenticated request to Zoho Bookings API
 */
export async function zohoApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getZohoAccessToken();
  const apiBase = Deno.env.get('ZB_API_BASE') || 'https://www.zohoapis.com';
  const url = `${apiBase}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Zoho API error (${response.status}): ${error}`);
  }

  return response.json();
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status = 500) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
