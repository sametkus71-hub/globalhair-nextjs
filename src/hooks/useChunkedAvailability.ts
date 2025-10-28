import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AvailabilitySlot {
  date: string;
  available_slots: string[];
}

interface ChunkedAvailabilityState {
  availability: Map<string, AvailabilitySlot>;
  isLoadingFirstChunk: boolean;
  isLoadingBackground: boolean;
  loadedMonths: Set<string>;
  error: Error | null;
}

const CHUNK_SIZE = 5; // 5 days per chunk
const MAX_MONTHS_AHEAD = 2;

export const useChunkedAvailability = (
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult' | null,
  location: 'online' | 'onsite' | null,
  currentMonth: Date
) => {
  const [state, setState] = useState<ChunkedAvailabilityState>({
    availability: new Map(),
    isLoadingFirstChunk: false,
    isLoadingBackground: false,
    loadedMonths: new Set(),
    error: null,
  });

  const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

  const loadChunk = useCallback(async (
    startDate: Date,
    endDate: Date,
    isFirstChunk: boolean
  ) => {
    if (!serviceType || !location) return;

    try {
      const { data, error } = await supabase.functions.invoke(
        'zoho-availability-range',
        {
          body: {
            serviceType,
            location,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        }
      );

      if (error) throw error;

      // Merge new availability into existing
      setState(prev => {
        const newAvailability = new Map(prev.availability);
        data.availability.forEach((slot: AvailabilitySlot) => {
          newAvailability.set(slot.date, slot);
        });

        return {
          ...prev,
          availability: newAvailability,
          isLoadingFirstChunk: false,
          error: null,
        };
      });
    } catch (error) {
      console.error('Error loading chunk:', error);
      setState(prev => ({
        ...prev,
        isLoadingFirstChunk: false,
        isLoadingBackground: false,
        error: error as Error,
      }));
    }
  }, [serviceType, location]);

  const loadMonthInChunks = useCallback(async (monthDate: Date) => {
    if (!serviceType || !location) return;

    const monthKey = getMonthKey(monthDate);
    
    // Skip if already loaded
    if (state.loadedMonths.has(monthKey)) return;

    // Check if month is within allowed range
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + MAX_MONTHS_AHEAD);
    
    if (monthDate > maxDate) {
      console.log('Month is beyond 2-month limit');
      return;
    }

    // Mark month as being loaded
    setState(prev => ({
      ...prev,
      loadedMonths: new Set([...prev.loadedMonths, monthKey]),
      isLoadingFirstChunk: true,
    }));

    // Get first and last day of month
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    // Skip past days
    const startDate = firstDay < today ? today : firstDay;

    // Generate chunks
    const chunks: Array<{ start: Date; end: Date }> = [];
    let chunkStart = new Date(startDate);

    while (chunkStart <= lastDay) {
      const chunkEnd = new Date(chunkStart);
      chunkEnd.setDate(chunkEnd.getDate() + CHUNK_SIZE - 1);
      
      if (chunkEnd > lastDay) {
        chunks.push({ start: new Date(chunkStart), end: new Date(lastDay) });
        break;
      } else {
        chunks.push({ start: new Date(chunkStart), end: new Date(chunkEnd) });
        chunkStart.setDate(chunkStart.getDate() + CHUNK_SIZE);
      }
    }

    console.log(`Loading ${chunks.length} chunks for ${monthKey}`);

    // Load first chunk immediately
    if (chunks.length > 0) {
      await loadChunk(chunks[0].start, chunks[0].end, true);
    }

    // Load remaining chunks in background
    if (chunks.length > 1) {
      setState(prev => ({ ...prev, isLoadingBackground: true }));

      // Load remaining chunks sequentially in background
      for (let i = 1; i < chunks.length; i++) {
        await loadChunk(chunks[i].start, chunks[i].end, false);
      }

      setState(prev => ({ ...prev, isLoadingBackground: false }));
    }
  }, [serviceType, location, state.loadedMonths, loadChunk]);

  // Auto-load current month when dependencies change
  useEffect(() => {
    loadMonthInChunks(currentMonth);
  }, [currentMonth, serviceType, location]);

  const getAvailability = useCallback((date: Date): AvailabilitySlot | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return state.availability.get(dateStr);
  }, [state.availability]);

  const hasAvailability = useCallback((date: Date): boolean => {
    const slot = getAvailability(date);
    return slot ? slot.available_slots.length > 0 : false;
  }, [getAvailability]);

  return {
    availability: Array.from(state.availability.values()),
    isLoadingFirstChunk: state.isLoadingFirstChunk,
    isLoadingBackground: state.isLoadingBackground,
    error: state.error,
    getAvailability,
    hasAvailability,
    loadMonth: loadMonthInChunks,
  };
};
