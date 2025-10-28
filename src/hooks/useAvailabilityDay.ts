import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilityDayResponse {
  data: {
    date: string;
    available_slots: string[];
    service: {
      type: string;
      location: string;
      duration: number;
    };
  };
}

export const useAvailabilityDay = (
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult' | null,
  location: 'online' | 'onsite' | null,
  date: string | null
) => {
  return useQuery({
    queryKey: ['availability-day', serviceType, location, date],
    queryFn: async () => {
      if (!serviceType || !location || !date) {
        throw new Error('Service type, location, and date are required');
      }

      const { data, error } = await supabase.functions.invoke<AvailabilityDayResponse>(
        'zoho-availability-day',
        {
          body: { serviceType, location, date },
        }
      );

      if (error) throw error;
      return data.data;
    },
    enabled: !!serviceType && !!location && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};
