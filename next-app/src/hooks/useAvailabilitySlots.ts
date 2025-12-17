'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilitySlotsResult {
  availableSlots: string[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches available time slots for a specific service, location, and date
 * by querying the availability_slots table and merging slots from all staff members
 */
export function useAvailabilitySlots(
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult' | null,
  location: 'online' | 'onsite' | null,
  date: string | null
): AvailabilitySlotsResult {
  // CEO consult is one service in Zoho, map both online/onsite to same data
  const serviceKey = serviceType && location 
    ? (serviceType === 'ceo_consult' ? 'ceo_consult_online' : `${serviceType}_${location}`)
    : null;

  const { data, isLoading, error } = useQuery({
    queryKey: ['availability-slots', serviceKey, date],
    queryFn: async () => {
      if (!serviceKey || !date) {
        return { availableSlots: [] };
      }

      // Query availability_slots for all staff members for this service and date
      const { data: slotsData, error: queryError } = await supabase
        .from('availability_slots')
        .select('time_slots, staff_name')
        .eq('service_key', serviceKey)
        .eq('date', date)
        .eq('zoho_response_status', 'success');

      if (queryError) {
        console.error('Error fetching availability slots:', queryError);
        throw queryError;
      }

      // Merge time slots from all staff members
      const allSlots = new Set<string>();
      
      slotsData?.forEach((row: any) => {
        const slots = Array.isArray(row.time_slots) ? row.time_slots : [];
        slots.forEach((slot: string) => {
          // Validate slot format (HH:MM)
          if (/^\d{2}:\d{2}$/.test(slot)) {
            allSlots.add(slot);
          }
        });
      });

      // Sort slots chronologically
      const sortedSlots = Array.from(allSlots).sort();

      return {
        availableSlots: sortedSlots,
      };
    },
    enabled: !!serviceKey && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    availableSlots: data?.availableSlots || [],
    isLoading,
    error: error as Error | null,
  };
}
