// Zoho OAuth and API utilities

interface ZohoTokenResponse {
  access_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
}

interface ZohoTokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: ZohoTokenCache | null = null;

/**
 * Get a valid Zoho access token (cached for 55 minutes)
 */
export async function getZohoAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

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

  // Cache token for 55 minutes (5 minutes before expiry)
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + 55 * 60 * 1000,
  };

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
