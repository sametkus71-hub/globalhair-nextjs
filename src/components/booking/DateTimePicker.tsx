import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAvailabilityCache } from '@/hooks/useAvailabilityCache';
import { useAvailabilitySlots } from '@/hooks/useAvailabilitySlots';
import { Calendar } from '@/components/ui/calendar';
import { ServiceType, LocationType } from './BookingWizard';
import { format } from 'date-fns';
import { nl, enGB } from 'date-fns/locale';

interface DateTimePickerProps {
  serviceType: ServiceType;
  location: LocationType;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}

export const DateTimePicker = ({ serviceType, location, onSelect, onBack }: DateTimePickerProps) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelect(format(selectedDate, 'yyyy-MM-dd'), time);
    }
  };

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
    <div className="flex flex-col min-h-screen">
      {/* Back button */}
      <div className="p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'nl' ? 'Terug' : 'Back'}
        </button>
      </div>

      <div className="space-y-6">
        {isLoadingCache ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-medium text-white mb-4 px-4">
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
                  className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
                />
              </div>
            </div>

            {selectedDate && (
              <div className="px-4">
                <h3 className="text-lg font-medium text-white mb-4">
                  {language === 'nl' ? 'Selecteer een tijd' : 'Select a time'}
                </h3>
                {isSlotsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
                  </div>
                ) : availableSlots && availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleTimeSelect(slot)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === slot
                            ? 'bg-white/20 text-white border-white/40'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
                        } border backdrop-blur-sm`}
                      >
                        {slot}
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
    </div>
  );
};
