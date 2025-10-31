import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

      const serviceKey = `${serviceType}_${location}`;
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('availability_slots')
        .select('date')
        .eq('service_key', serviceKey)
        .eq('zoho_response_status', 'success')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching first available date:', error);
        return null;
      }

      return data?.date ? new Date(data.date) : null;
    },
    enabled: !!serviceType && !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
