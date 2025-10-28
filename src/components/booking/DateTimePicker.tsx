import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAvailabilityRange } from '@/hooks/useAvailabilityRange';
import { useAvailabilityDay } from '@/hooks/useAvailabilityDay';
import { Calendar } from '@/components/ui/calendar';
import { ServiceType, LocationType } from './BookingWizard';
import { format, parseISO, startOfMonth, addMonths } from 'date-fns';
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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const { data: rangeData, isLoading: rangeLoading, isFetching } = useAvailabilityRange(
    serviceType, 
    location,
    year,
    month
  );
  
  const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const { data: dayData, isLoading: dayLoading } = useAvailabilityDay(
    serviceType,
    location,
    selectedDateString
  );

  // Get dates with availability
  const availableDates = rangeData?.availability
    .filter(slot => slot.available_slots.length > 0)
    .map(slot => parseISO(slot.date)) || [];

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
          <h3 className="text-xl font-light text-white">
            {language === 'nl' ? 'Kies een datum' : 'Choose a date'}
          </h3>
          
          {rangeLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
              <p className="text-sm text-white/60">
                {language === 'nl' ? 'Beschikbaarheid laden (~7 seconden)...' : 'Loading availability (~7 seconds)...'}
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Minimalist loading overlay */}
              {isFetching && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl backdrop-blur-sm bg-black/20">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              
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
                  onMonthChange={setCurrentMonth}
                  disabled={(date) => {
                    const isPast = date < new Date();
                    const isAvailable = availableDates.some(
                      d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    );
                    return isPast || !isAvailable;
                  }}
                  locale={language === 'nl' ? nl : enGB}
                  className="pointer-events-auto"
                />
              </div>
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
