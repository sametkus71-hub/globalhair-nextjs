import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAvailabilityCache } from '@/hooks/useAvailabilityCache';
import { useAvailabilitySlots } from '@/hooks/useAvailabilitySlots';
import { useStaffSelection } from '@/hooks/useStaffSelection';
import { Calendar } from '@/components/ui/calendar';
import { ServiceType, LocationType } from './BookingWizard';
import { getServiceConfig } from '@/lib/service-config';
import { format } from 'date-fns';
import { nl, enGB } from 'date-fns/locale';

interface DateTimePickerProps {
  serviceType: ServiceType;
  location: LocationType;
  onSelect: (date: string, time: string, staffId: string, staffName: string) => void;
}

export const DateTimePicker = ({ serviceType, location, onSelect }: DateTimePickerProps) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get service configuration for duration
  const config = getServiceConfig(serviceType, location);
  const durationMinutes = config.durationMinutes;

  // Format time slot with duration (e.g., "10:00 - 10:30")
  const formatTimeSlotWithDuration = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + durationMinutes, 0, 0);
    const endHours = String(endDate.getHours()).padStart(2, '0');
    const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
    return `${startTime} - ${endHours}:${endMinutes}`;
  };

  // Load cached availability days
  const {
    data: cacheData,
    isLoading: isLoadingCache,
  } = useAvailabilityCache(
    serviceType,
    location,
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  // Fetch available slots for selected date from availability_slots table
  const { 
    availableSlots, 
    isLoading: isSlotsLoading 
  } = useAvailabilitySlots(serviceType, location, selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null);

  // Get staff assignment for selected time
  const {
    staffId,
    staffName,
    isLoading: isStaffLoading,
  } = useStaffSelection(
    serviceType,
    location,
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
    selectedTime || null
  );

  // Auto-select first available date
  useEffect(() => {
    if (cacheData?.availableDates && cacheData.availableDates.length > 0 && !selectedDate) {
      const firstAvailableDate = new Date(cacheData.availableDates[0]);
      setSelectedDate(firstAvailableDate);
    }
  }, [cacheData?.availableDates, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (slot: string) => {
    setSelectedTime(slot);
    if (selectedDate && staffId && staffName) {
      onSelect(format(selectedDate, 'yyyy-MM-dd'), slot, staffId, staffName);
    }
  };

  // When staff is assigned, call onSelect
  useEffect(() => {
    if (selectedDate && selectedTime && staffId && staffName && !isStaffLoading) {
      onSelect(format(selectedDate, 'yyyy-MM-dd'), selectedTime, staffId, staffName);
    }
  }, [selectedDate, selectedTime, staffId, staffName, isStaffLoading, onSelect]);

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const isDateDisabled = (date: Date) => {
    const dayOfWeek = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isPast = date < today;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Check if date has availability from cache
    const hasSlots = cacheData?.hasAvailability(date) || false;
    
    return isPast || isWeekend || !hasSlots;
  };

  return (
    <div className="flex flex-col space-y-6 py-4">
      {isLoadingCache ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-base font-medium text-white/90 mb-4">
              {language === 'nl' ? 'Selecteer een datum' : 'Select a date'}
            </h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                month={currentMonth}
                onMonthChange={handleMonthChange}
                locale={language === 'nl' ? nl : enGB}
                className="rounded-lg border border-white/10 bg-white/5"
              />
            </div>
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-base font-medium text-white/90 mb-4">
                {language === 'nl' ? 'Selecteer een tijd' : 'Select a time'}
              </h3>
              {isSlotsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
                </div>
              ) : availableSlots && availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        selectedTime === slot
                          ? 'bg-white/15 border-white/30 text-white'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {formatTimeSlotWithDuration(slot)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white/50 py-8">
                  {language === 'nl' ? 'Geen beschikbare tijden' : 'No available times'}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};