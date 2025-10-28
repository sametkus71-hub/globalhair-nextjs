import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AvailabilitySlot {
  date: string;
  available_slots: string[];
}

interface AvailabilityRangeResponse {
  data: {
    availability: AvailabilitySlot[];
    service: {
      type: string;
      location: string;
      duration: number;
    };
  };
}

export const useAvailabilityRange = (
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult' | null,
  location: 'online' | 'onsite' | null
) => {
  return useQuery({
    queryKey: ['availability-range', serviceType, location],
    queryFn: async () => {
      if (!serviceType || !location) {
        throw new Error('Service type and location are required');
      }

      const { data, error } = await supabase.functions.invoke<AvailabilityRangeResponse>(
        'zoho-availability-range',
        {
          body: { serviceType, location },
        }
      );

      if (error) throw error;
      return data.data;
    },
    enabled: !!serviceType && !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
