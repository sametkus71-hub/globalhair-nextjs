import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useChunkedAvailability } from '@/hooks/useChunkedAvailability';
import { useAvailabilityDay } from '@/hooks/useAvailabilityDay';
import { Calendar } from '@/components/ui/calendar';
import { ServiceType, LocationType } from './BookingWizard';
import { format, startOfMonth } from 'date-fns';
import { nl, enGB } from 'date-fns/locale';

interface DateTimePickerProps {
  serviceType: ServiceType;
  location: LocationType;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}

export const DateTimePicker = ({ serviceType, location, onSelect, onBack }: DateTimePickerProps) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  // Use chunked availability loading
  const {
    hasAvailability,
    isLoadingFirstChunk,
    isLoadingBackground,
    loadMonth,
  } = useChunkedAvailability(serviceType, location, currentMonth);
  
  const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const { data: dayData, isLoading: dayLoading } = useAvailabilityDay(
    serviceType,
    location,
    selectedDateString
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDateString) {
      onSelect(selectedDateString, time);
    }
  };

  const handleMonthChange = (newMonth: Date) => {
    const monthStart = startOfMonth(newMonth);
    setCurrentMonth(monthStart);
    loadMonth(monthStart);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 p-4 backdrop-blur-md" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{language === 'nl' ? 'Terug' : 'Back'}</span>
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Date Selection */}
        <div className="space-y-4 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-light text-white">
              {language === 'nl' ? 'Kies een datum' : 'Choose a date'}
            </h3>
            {isLoadingBackground && (
              <span className="text-xs text-white/40 flex items-center gap-2">
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                {language === 'nl' ? 'Meer laden...' : 'Loading more...'}
              </span>
            )}
          </div>
          
          {isLoadingFirstChunk ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
              <p className="text-sm text-white/60">
                {language === 'nl' ? 'Eerste data laden (~2 seconden)...' : 'Loading initial dates (~2 seconds)...'}
              </p>
            </div>
          ) : (
            <div 
              className="rounded-xl p-4 inline-block"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={currentMonth}
                onMonthChange={handleMonthChange}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = date < today;
                  
                  // Disable weekends
                  const dayOfWeek = date.getDay();
                  if (dayOfWeek === 0 || dayOfWeek === 6) return true;
                  
                  return isPast || !hasAvailability(date);
                }}
                locale={language === 'nl' ? nl : enGB}
                className="pointer-events-auto"
              />
            </div>
          )}
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="space-y-4">
            <h3 className="text-xl font-light text-white">
              {language === 'nl' ? 'Kies een tijd' : 'Choose a time'}
            </h3>
            
            {dayLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
              </div>
            ) : dayData?.available_slots.length === 0 ? (
              <div 
                className="rounded-xl p-6 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <p className="text-white/60">
                  {language === 'nl' ? 'Geen tijdslots beschikbaar' : 'No time slots available'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {dayData?.available_slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleTimeSelect(slot)}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-white transition-all duration-200"
                    style={{
                      background: selectedTime === slot 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: selectedTime === slot
                        ? '1px solid rgba(255, 255, 255, 0.4)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
