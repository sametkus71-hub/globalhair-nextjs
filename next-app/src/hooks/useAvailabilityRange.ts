'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AvailabilitySlot {
  date: string;
  available_slots: string[];
}

interface AvailabilityRangeResponse {
  availability: AvailabilitySlot[];
  service: {
    type: string;
    location: string;
    duration: number;
  };
}

export const useAvailabilityRange = (
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult' | null,
  location: 'online' | 'onsite' | null,
  year: number,
  month: number
) => {
  return useQuery({
    queryKey: ['availability-month', serviceType, location, year, month],
    queryFn: async () => {
      if (!serviceType || !location) {
        throw new Error('Service type and location are required');
      }

      const { data, error } = await supabase.functions.invoke<AvailabilityRangeResponse>(
        'zoho-availability-range',
        {
          body: { serviceType, location, year, month },
        }
      );

      if (error) throw error;
      return data;
    },
    enabled: !!serviceType && !!location,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};
