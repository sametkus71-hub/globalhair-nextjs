import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getServiceConfig } from '@/lib/service-config';

interface StaffSelectionResult {
  staffId: string | null;
  staffName: string | null;
  isLoading: boolean;
}

/**
 * Determines which staff member to assign for a given time slot
 * Priority: 1) Use preferred staff if available, 2) Use any available staff
 */
export function useStaffSelection(
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult' | null,
  location: 'online' | 'onsite' | null,
  date: string | null,
  time: string | null
): StaffSelectionResult {
  // CEO consult is one service in Zoho, map both online/onsite to same data
  const serviceKey = serviceType && location 
    ? (serviceType === 'ceo_consult' ? 'ceo_consult_online' : `${serviceType}_${location}`)
    : null;

  const { data, isLoading } = useQuery({
    queryKey: ['staff-selection', serviceKey, date, time],
    queryFn: async () => {
      if (!serviceType || !location || !serviceKey || !date || !time) {
        return { staffId: null, staffName: null };
      }

      // Get service config to check for preferred staff
      const serviceConfig = getServiceConfig(serviceType, location);

      // Query availability_slots to find which staff members have this time slot
      const { data: slotsData, error } = await supabase
        .from('availability_slots')
        .select('staff_id, staff_name, time_slots')
        .eq('service_key', serviceKey)
        .eq('date', date)
        .eq('zoho_response_status', 'success');

      if (error) {
        console.error('Error fetching staff availability:', error);
        throw error;
      }

      // Filter staff who have this specific time slot
      const availableStaff = slotsData?.filter((row: any) => {
        const slots = Array.isArray(row.time_slots) ? row.time_slots : [];
        return slots.includes(time);
      }) || [];

      if (availableStaff.length === 0) {
        return { staffId: null, staffName: null };
      }

      // Priority 1: Check if preferred staff is available
      if (serviceConfig.preferredStaffId) {
        const preferredStaff = availableStaff.find(
          (staff: any) => staff.staff_id === serviceConfig.preferredStaffId
        );
        if (preferredStaff) {
          return {
            staffId: preferredStaff.staff_id,
            staffName: preferredStaff.staff_name,
          };
        }
      }

      // Priority 2: Use first available staff
      const firstStaff = availableStaff[0];
      return {
        staffId: firstStaff.staff_id,
        staffName: firstStaff.staff_name,
      };
    },
    enabled: !!serviceKey && !!date && !!time,
    staleTime: 2 * 60 * 1000,
  });

  return {
    staffId: data?.staffId || null,
    staffName: data?.staffName || null,
    isLoading,
  };
}
