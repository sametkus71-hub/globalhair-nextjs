import { zohoApiRequest, errorResponse, successResponse } from '../_shared/zoho-utils.ts';
import { formatDateForZoho } from '../_shared/date-helpers.ts';

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
    console.log('=== SIMPLE ZOHO TEST START ===');
    
    // Hard-code Steven's staff ID and today's date for simplicity
    const staffId = '166653000000028001'; // Steven
    const serviceId = '166653000001098006'; // V6 Hairboost Online
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 1); // Tomorrow
    const dateStr = formatDateForZoho(testDate);
    
    console.log(`Testing availability for staff ${staffId} on ${dateStr}`);
    
    // Call Zoho API directly
    const endpoint = `/bookings/v1/json/availableslots`;
    const params = new URLSearchParams({
      service_id: serviceId,
      staff_id: staffId,
      selected_date: dateStr,
    });
    
    console.log(`Calling Zoho: ${endpoint}?${params.toString()}`);
    
    const response = await zohoApiRequest<any>(
      `${endpoint}?${params.toString()}`,
      { method: 'GET' }
    );
    
    console.log('Raw Zoho response:', JSON.stringify(response, null, 2));
    
    return successResponse({
      message: 'Zoho API test successful',
      request: {
        staff_id: staffId,
        service_id: serviceId,
        date: dateStr,
      },
      raw_zoho_response: response,
    }, 200, corsHeaders);
    
  } catch (error) {
    console.error('Test failed:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500,
      corsHeaders
    );
  }
});
