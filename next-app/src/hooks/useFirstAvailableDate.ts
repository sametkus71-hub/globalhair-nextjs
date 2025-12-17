'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const useFirstAvailableDate = (
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult' | null,
  location: 'online' | 'onsite' | null
) => {
  return useQuery({
    queryKey: ['first-available-date', serviceType, location],
    queryFn: async () => {
      if (!serviceType || !location) {
        return null;
      }

      // Normalize serviceKey - ceo_consult always uses 'online' key regardless of location
      const serviceKey = serviceType === 'ceo_consult' 
        ? 'ceo_consult_online' 
        : `${serviceType}_${location}`;
      
      const today = format(new Date(), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('availability_slots')
        .select('date, time_slots')
        .eq('service_key', serviceKey)
        .eq('zoho_response_status', 'success')
        .gte('date', today)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching first available date:', error);
        return null;
      }

      // Use a Map to aggregate availability by date (handle multiple staff per date)
      const dateHasSlots = new Map<string, boolean>();
      
      for (const row of data ?? []) {
        const hasSlots = Array.isArray(row.time_slots) && row.time_slots.length > 0;
        const currentValue = dateHasSlots.get(row.date) ?? false;
        dateHasSlots.set(row.date, currentValue || hasSlots);
      }

      // Find earliest date with availability
      const availableDates = Array.from(dateHasSlots.entries())
        .filter(([_, hasSlots]) => hasSlots)
        .map(([date]) => date)
        .sort();

      const earliestDate = availableDates[0];
      return earliestDate ? new Date(earliestDate) : null;
    },
    enabled: !!serviceType && !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
