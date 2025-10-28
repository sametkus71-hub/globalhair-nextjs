import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilityCacheResult {
  availableDates: string[];
  hasAvailability: (date: Date) => boolean;
  isStale: boolean;
  lastSyncedAt: string | null;
}

/**
 * Hook to fetch cached availability days from the database.
 * Uses pre-synced data for blazing fast performance (<100ms).
 */
export const useAvailabilityCache = (
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult' | null,
  location: 'online' | 'onsite' | null,
  year: number,
  month: number
): {
  data: AvailabilityCacheResult | undefined;
  isLoading: boolean;
  error: Error | null;
} => {
  return useQuery({
    queryKey: ['availability-cache', serviceType, location, year, month],
    queryFn: async (): Promise<AvailabilityCacheResult> => {
      if (!serviceType || !location) {
        throw new Error('Service type and location are required');
      }

      // Map service type to cache key
      // CEO consult uses single key regardless of location
      const serviceKey = serviceType === 'ceo_consult' 
        ? 'ceo_consult' 
        : `${serviceType}_${location}`;

      // Calculate date range for the month
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const { data, error } = await supabase
        .from('availability_cache')
        .select('date, has_availability, last_synced_at')
        .eq('service_key', serviceKey)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .eq('has_availability', true)
        .order('date');

      if (error) throw error;

      // Convert to Map for fast lookups
      const availabilityMap = new Map(
        data.map(d => [d.date, d.has_availability])
      );

      // Check if data is stale (older than 5 hours)
      const lastSyncedAt = data.length > 0 ? data[0].last_synced_at : null;
      let isStale = false;
      
      if (lastSyncedAt) {
        const syncTime = new Date(lastSyncedAt);
        const now = new Date();
        const hoursSinceSync = (now.getTime() - syncTime.getTime()) / (1000 * 60 * 60);
        isStale = hoursSinceSync > 5;
      }

      return {
        availableDates: data.map(d => d.date),
        hasAvailability: (date: Date) => {
          const dateStr = date.toISOString().split('T')[0];
          return availabilityMap.get(dateStr) || false;
        },
        isStale,
        lastSyncedAt,
      };
    },
    enabled: !!serviceType && !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};
