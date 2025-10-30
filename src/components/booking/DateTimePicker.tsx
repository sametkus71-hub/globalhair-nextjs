import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAvailabilityCache } from '@/hooks/useAvailabilityCache';
import { useAvailabilitySlots } from '@/hooks/useAvailabilitySlots';
import { useStaffSelection } from '@/hooks/useStaffSelection';
import { ServiceType, LocationType } from './BookingWizard';
import { getServiceConfig } from '@/lib/service-config';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { nl, enGB } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Generate calendar days
  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const locale = language === 'nl' ? nl : enGB;
  const weekDays = language === 'nl' 
    ? ['Ma', 'Di', 'Wo', 'Do', 'Fri', 'Za', 'Zo']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getDayClasses = (day: Date) => {
    const classes = ['cal-day'];
    const isOutside = !isSameMonth(day, currentMonth);
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    const isDisabled = isDateDisabled(day);
    const dayHasAvailability = cacheData?.hasAvailability(day) || false;
    const isUnavailable = !isDisabled && !isOutside && !dayHasAvailability;

    if (isOutside) classes.push('is-outside');
    if (isToday(day)) classes.push('is-today');
    if (isSelected) classes.push('is-selected');
    if (isDisabled) classes.push('is-disabled');
    if (isUnavailable) classes.push('is-unavailable');

    return classes.join(' ');
  };

  return (
    <div className="cal">
      <style>{`
        .cal {
          color: var(--txt, #E6EDF5);
          border-radius: 24px;
          padding: 16px 16px 20px;
          background: radial-gradient(120% 120% at 80% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 60%, transparent 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
        }

        .cal-header {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .cal-month {
          font-size: clamp(18px, 2.6vw, 22px);
          font-weight: 600;
          margin: 0;
          flex: 1;
        }

        .cal-prev, .cal-next {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .cal-prev:hover, .cal-next:hover {
          background: rgba(255,255,255,0.08);
        }

        .cal-alt-link {
          color: rgba(230,237,245,0.65);
          text-decoration: underline;
          font-size: 14px;
          cursor: pointer;
          margin-left: auto;
        }

        .cal-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          margin: 8px 0;
          color: rgba(230,237,245,0.65);
          font-size: 13px;
          text-align: center;
        }

        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }

        .cal-day {
          height: 56px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.35);
          backdrop-filter: blur(8px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          color: #E6EDF5;
          transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }

        .cal-day:hover:not(.is-disabled):not(.is-outside) {
          transform: translateY(-1px);
        }

        .cal-day.is-outside {
          opacity: 0.35;
          pointer-events: none;
        }

        .cal-day.is-today {
          outline: 2px solid rgba(255,255,255,0.35);
          outline-offset: 2px;
        }

        .cal-day.is-selected {
          background: linear-gradient(180deg, rgba(240,245,255,0.28), rgba(255,255,255,0.06));
          border-color: rgba(255,255,255,0.55);
          color: rgba(255,255,255,0.85);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.28), 0 6px 18px rgba(0,0,0,0.25);
        }

        .cal-day.is-disabled {
          opacity: 0.35;
          pointer-events: none;
        }

        .cal-day.is-unavailable {
          background: linear-gradient(180deg, rgba(255,69,58,0.18), rgba(255,69,58,0.32));
          border-color: rgba(255,69,58,0.55);
          color: #fff;
        }

        .cal-times-title {
          margin: 6px 0 10px;
          font-size: clamp(16px, 2.2vw, 18px);
          color: rgba(255,255,255,0.85);
        }

        .time-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 2px 2px 8px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .time-strip::-webkit-scrollbar {
          display: none;
        }

        .time-strip {
          scrollbar-width: none;
        }

        .time-pill {
          flex: 0 0 auto;
          min-width: 200px;
          height: 56px;
          border-radius: 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.35);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          color: #E6EDF5;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }

        .time-pill:hover {
          transform: translateY(-1px);
        }

        .time-pill.is-selected {
          background: linear-gradient(180deg, rgba(240,245,255,0.28), rgba(255,255,255,0.06));
          border-color: rgba(255,255,255,0.55);
          color: rgba(255,255,255,0.85);
        }

        .cal-cta {
          margin-top: 16px;
        }

        .btn-primary-wide {
          width: 100%;
          height: 64px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.35);
          background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04));
          color: rgba(255,255,255,0.85);
          font-weight: 700;
          font-size: 18px;
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-primary-wide:hover {
          background: linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08));
        }

        .btn-primary-wide:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {isLoadingCache ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
        </div>
      ) : (
        <>
          <div className="cal-header">
            <h3 className="cal-month">
              {format(currentMonth, 'MMMM yyyy', { locale })}
            </h3>
            <button 
              className="cal-prev" 
              onClick={goToPreviousMonth}
              aria-label={language === 'nl' ? 'Vorige maand' : 'Previous month'}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="cal-next" 
              onClick={goToNextMonth}
              aria-label={language === 'nl' ? 'Volgende maand' : 'Next month'}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="cal-weekdays">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="cal-grid">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                className={getDayClasses(day)}
                onClick={() => !isDateDisabled(day) && handleDateSelect(day)}
                disabled={isDateDisabled(day)}
              >
                {format(day, 'd')}
              </button>
            ))}
          </div>

          {selectedDate && (
            <div className="cal-times">
              <h4 className="cal-times-title">
                {language === 'nl' ? 'Selecteer tijd' : 'Select time'}
              </h4>
              {isSlotsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
                </div>
              ) : availableSlots && availableSlots.length > 0 ? (
                <div className="time-strip">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      className={`time-pill ${selectedTime === slot ? 'is-selected' : ''}`}
                    >
                      {formatTimeSlotWithDuration(slot)}
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

          <div className="cal-cta">
            <button 
              className="btn-primary-wide"
              disabled={!selectedDate || !selectedTime}
            >
              {language === 'nl' ? 'Volgende' : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};