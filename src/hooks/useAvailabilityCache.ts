import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

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
  bookingLocation: 'online' | 'onsite' | null,
  year: number,
  month: number
): {
  data: AvailabilityCacheResult | undefined;
  isLoading: boolean;
  error: Error | null;
} => {
  return useQuery({
    queryKey: ['availability-cache', serviceType, bookingLocation, year, month],
    queryFn: async (): Promise<AvailabilityCacheResult> => {
      if (!serviceType || !bookingLocation) {
        throw new Error('Service type and location are required');
      }

      // Map service type to cache key
      // CEO consult is one service in Zoho, map both online/onsite to same data
      const serviceKey = serviceType === 'ceo_consult' 
        ? 'ceo_consult_online' 
        : `${serviceType}_${bookingLocation}`;

      // Calculate date range for the month
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      // Query availability_slots directly - a date has availability if any staff has slots
      const { data, error } = await supabase
        .from('availability_slots')
        .select('date, time_slots, last_synced_at')
        .eq('service_key', serviceKey)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .eq('zoho_response_status', 'success')
        .order('date');

      if (error) throw error;

      // Group by date and check if any staff has slots
      const dateAvailability = new Map<string, boolean>();
      
      for (const row of data) {
        const hasSlots = Array.isArray(row.time_slots) && row.time_slots.length > 0;
        if (!dateAvailability.has(row.date)) {
          dateAvailability.set(row.date, hasSlots);
        } else if (hasSlots) {
          dateAvailability.set(row.date, true);
        }
      }

      // Get unique dates with availability
      const uniqueDates = Array.from(dateAvailability.entries())
        .filter(([_, hasAvailability]) => hasAvailability)
        .map(([date]) => date)
        .sort();

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
        availableDates: uniqueDates,
        hasAvailability: (date: Date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          return dateAvailability.get(dateStr) || false;
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
