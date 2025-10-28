import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { errorResponse, successResponse } from '../_shared/zoho-utils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, serviceType, location, selectedDate } = await req.json();

    // Initialize Supabase client with service role for cache invalidation
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // TODO: Implement actual Zoho booking logic here
    // This is a placeholder that will be implemented in Phase 3

    // After successful booking, invalidate the cache for this date
    if (serviceType && location && selectedDate) {
      // Map service type to cache key
      const serviceKey = serviceType === 'ceo_consult' 
        ? 'ceo_consult' 
        : `${serviceType}_${location}`;

      console.log(`🗑️ Invalidating cache for ${serviceKey} on ${selectedDate}`);

      const { error: deleteError } = await supabase
        .from('availability_cache')
        .delete()
        .eq('service_key', serviceKey)
        .eq('date', selectedDate);

      if (deleteError) {
        console.error('Failed to invalidate cache:', deleteError);
      } else {
        console.log(`✅ Cache invalidated successfully`);
      }
    }

    // Placeholder response
    return successResponse({
      message: 'Booking endpoint - To be implemented in Phase 3',
      status: 'placeholder',
      bookingId,
      cacheInvalidated: true,
    }, 200, corsHeaders);

  } catch (error) {
    console.error('Booking error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Booking failed',
      500,
      corsHeaders
    );
  }
});
