'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAvailabilityCache } from '@/hooks/useAvailabilityCache';
import { useAvailabilitySlots } from '@/hooks/useAvailabilitySlots';
import { useStaffSelection } from '@/hooks/useStaffSelection';
import { useFirstAvailableDate } from '@/hooks/useFirstAvailableDate';
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

export const DateTimePicker = ({ serviceType, pathname, onSelect }: DateTimePickerProps) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const timeStripRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const dateKey = (d: Date) => format(d, 'yyyy-MM-dd');
  const monthKey = (d: Date) => format(d, 'yyyy-MM');

  // Get service configuration for duration
  const config = getServiceConfig(serviceType, location);
  const durationMinutes = config.durationMinutes;

  // Fetch the first available date to initialize the calendar
  const { data: firstAvailableDate } = useFirstAvailableDate(serviceType, location);

  // Load saved date/time from session storage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('booking-date-time');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date) {
          const parsedDate = new Date(parsed.date);
          setSelectedDate(parsedDate);
          setCurrentMonth(parsedDate);
        }
        if (parsed.time) {
          setSelectedTime(parsed.time);
        }
      } catch (e) {
        console.error('Failed to parse saved date/time', e);
      }
    }
  }, []);

  // Initialize currentMonth with the first available date (only on initial load if not already set)
  useEffect(() => {
    if (firstAvailableDate && !currentMonth) {
      setCurrentMonth(firstAvailableDate);
    }
    // Intentionally do NOT re-align if user has already navigated
  }, [firstAvailableDate, currentMonth]);

  // Save selected date and time to session storage
  useEffect(() => {
    if (selectedDate || selectedTime) {
      sessionStorage.setItem('booking-date-time', JSON.stringify({
        date: selectedDate?.toISOString(),
        time: selectedTime
      }));
    }
  }, [selectedDate, selectedTime]);

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
    currentMonth?.getFullYear() ?? new Date().getFullYear(),
    currentMonth?.getMonth() ?? new Date().getMonth()
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

  const handleDateSelect = (date: Date | null) => {
    if (date && isDateDisabled(date)) {
      return; // Don't allow selecting disabled dates
    }
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (slot: string) => {
    if (hasDragged) {
      setHasDragged(false);
      return;
    }
    setSelectedTime(slot);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime && staffId && staffName) {
      onSelect(format(selectedDate, 'yyyy-MM-dd'), selectedTime, staffId, staffName);
    }
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timeStripRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - timeStripRef.current.offsetLeft);
    setScrollLeft(timeStripRef.current.scrollLeft);
    if (timeStripRef.current) {
      timeStripRef.current.style.scrollBehavior = 'auto';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !timeStripRef.current) return;
    e.preventDefault();
    const x = e.pageX - timeStripRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    timeStripRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (timeStripRef.current) {
      timeStripRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (timeStripRef.current) {
      timeStripRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const scrollTimeStrip = (direction: 'left' | 'right') => {
    if (!timeStripRef.current) return;
    const scrollAmount = 300;
    const newScrollLeft = direction === 'left' 
      ? timeStripRef.current.scrollLeft - scrollAmount
      : timeStripRef.current.scrollLeft + scrollAmount;
    timeStripRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const isDateNotSelectable = (date: Date) => {
    const dayOfWeek = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = date < today;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isOutside = !isSameMonth(date, currentMonth);
    
    return isPast || isWeekend || isOutside;
  };

  const isDateFullyBooked = (date: Date) => {
    if (isDateNotSelectable(date)) return false;
    const key = dateKey(date);
    const hasSlots = cacheData?.availableDates?.includes(key) ?? false;
    return !hasSlots;
  };

  const isDateDisabled = (date: Date) => {
    return isDateNotSelectable(date) || isDateFullyBooked(date);
  };
  // Auto-select the first available date within the current month based on cache
  useEffect(() => {
    if (!cacheData || !currentMonth) return;

    // Clear invalid selection asap
    if (selectedDate && isDateDisabled(selectedDate)) {
      setSelectedDate(null);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cmKey = monthKey(currentMonth);
    const todayKey = dateKey(today);

    const firstKeyInMonth = (cacheData.availableDates ?? [])
      .filter((k) => k.startsWith(cmKey) && k >= todayKey)
      .sort()[0];

    const selectedInvalid =
      !selectedDate ||
      isDateDisabled(selectedDate) ||
      !isSameMonth(selectedDate, currentMonth);

    if (selectedInvalid) {
      if (firstKeyInMonth) {
        setSelectedDate(new Date(firstKeyInMonth));
      } else {
        setSelectedDate(null); // No valid dates in this month
      }
    }
  }, [cacheData, currentMonth, selectedDate]);
  // Generate calendar days
  const generateCalendarDays = () => {
    if (!currentMonth) return [];
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
    if (!currentMonth) return;
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    if (!currentMonth) return;
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getDayClasses = (day: Date) => {
    const classes = ['cal-day'];
    const notSelectable = isDateNotSelectable(day);
    const fullyBooked = isDateFullyBooked(day);
    const isDisabled = notSelectable || fullyBooked;
    const isSelected = selectedDate && isSameDay(day, selectedDate) && !isDisabled;

    if (notSelectable) classes.push('is-not-selectable');
    if (fullyBooked) classes.push('is-fully-booked');
    if (isToday(day)) classes.push('is-today');
    if (isSelected) classes.push('is-selected');

    return classes.join(' ');
  };

  return (
    <div className="cal">
      <style>{`
        .cal {
          color: var(--txt, #E6EDF5);
          padding: 10px 0px 1px 3px;
        }

        .cal-header {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .cal-month {
          font-size: 15px;
          font-weight: 400;
          margin: 0;
          flex: 1;
          background: linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0px 3.39px 18.55px #FFFFFF40;
        }

        .cal-prev, .cal-next {
          width: 32px;
          height: 32px;
          border-radius: 5.5px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(8px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.2s ease;
          position: relative;
        }

        .cal-prev::before, .cal-next::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(269.87deg, #4B555E 3.18%, #ACB9C1 51.79%, #FFFFFF 76.09%, #ACB9C1 88.24%, #4B555E 100.39%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .cal-prev:hover, .cal-next:hover {
          transform: translateY(-1px);
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
          gap: 6px;
          margin: 6px 0 4px;
          color: rgba(230,237,245,0.65);
          font-size: 11px;
          text-align: center;
        }

        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          margin-bottom: 12px;
        }

        .cal-day {
          aspect-ratio: 1;
          width: 100%;
          max-width: 44px;
          border-radius: 5.5px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(8px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 300;
          font-size: 12px;
          color: #E6EDF5;
          transition: transform 0.15s ease, background 0.2s ease;
          cursor: pointer;
          position: relative;
        }

        .cal-day::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(269.87deg, #4B555E 3.18%, #ACB9C1 51.79%, #FFFFFF 76.09%, #ACB9C1 88.24%, #4B555E 100.39%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .cal-day:hover:not(.is-not-selectable):not(.is-fully-booked) {
          transform: translateY(-1px);
        }

        .cal-day.is-not-selectable {
          pointer-events: none;
          cursor: not-allowed;
          background: transparent;
          color: hsl(var(--muted-foreground));
        }

        .cal-day.is-not-selectable::before {
          opacity: 0.3;
        }

        .cal-day.is-fully-booked {
          opacity: 0.6;
          pointer-events: none;
          cursor: not-allowed;
          background: rgba(253, 78, 78, 0.16);
          color: rgba(255, 255, 255, 0.7);
        }

        .cal-day.is-fully-booked::before {
          background: linear-gradient(269.87deg, #ef4444 3.18%, #dc2626 51.79%, #ef4444 76.09%, #b91c1c 88.24%, #ef4444 100.39%);
          opacity: 0.5;
        }

        .cal-day.is-today {
          border-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(7px);
          color: rgba(255, 255, 255, 0.25);
        }

        .cal-day.is-selected {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%);
          color: rgba(255,255,255,0.85);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.28), 0 6px 18px rgba(0,0,0,0.25);
        }

        .cal-day.is-selected::before {
          background: linear-gradient(269.87deg, #22c55e 3.18%, #4ade80 51.79%, #22c55e 76.09%, #16a34a 88.24%, #22c55e 100.39%);
        }

        .cal-times-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 4px 0 6px;
        }

        .cal-times-title {
          font-size: 15px;
          font-weight: 400;
          background: linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0px 3.39px 18.55px #FFFFFF40;
          flex: 1;
        }

        .time-nav {
          display: none;
        }

        @media (min-width: 1024px) {
          .time-nav {
            display: flex;
            width: 32px;
            height: 32px;
            border-radius: 5.5px;
            background: rgba(255,255,255,0.06);
            backdrop-filter: blur(8px);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.15s ease, background 0.2s ease;
            position: relative;
          }

          .time-nav::before {
            content: "";
            position: absolute;
            inset: 0;
            padding: 1px;
            border-radius: inherit;
            background: linear-gradient(269.87deg, #4B555E 3.18%, #ACB9C1 51.79%, #FFFFFF 76.09%, #ACB9C1 88.24%, #4B555E 100.39%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
            z-index: 0;
          }

          .time-nav:hover {
            transform: translateY(-1px);
          }
        }

        .time-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 2px 2px 6px;
          margin-right: -16px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          cursor: grab;
          user-select: none;
          scroll-behavior: smooth;
          transition: scroll 0.3s ease-out;
        }

        .time-strip:active {
          cursor: grabbing;
          scroll-behavior: auto;
        }

        .time-strip::-webkit-scrollbar {
          display: none;
        }

        .time-strip {
          scrollbar-width: none;
        }

        .time-pill {
          flex: 0 0 auto;
          min-width: 120px;
          height: 41px;
          border-radius: 6px;
          background: rgba(255,255,255,0.06);
          border: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          color: #E6EDF5;
          font-weight: 300;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          transition: transform 0.15s ease, background 0.2s ease;
          cursor: pointer;
          pointer-events: auto;
          position: relative;
        }

        .time-pill::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(269.87deg, #4B555E 3.18%, #ACB9C1 51.79%, #FFFFFF 76.09%, #ACB9C1 88.24%, #4B555E 100.39%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .time-pill:hover {
          transform: translateY(-1px);
        }

        .time-pill > * {
          position: relative;
          z-index: 1;
        }

        .time-pill.is-selected {
          background: linear-gradient(180deg, rgba(240,245,255,0.28), rgba(255,255,255,0.06));
          color: rgba(255,255,255,0.85);
        }

        .time-pill.is-selected::before {
          background: linear-gradient(269.87deg, #22c55e 3.18%, #4ade80 51.79%, #22c55e 76.09%, #16a34a 88.24%, #22c55e 100.39%);
        }

        .cal-cta {
          margin-top: 10px;
        }

        .btn-primary-wide {
          width: 100%;
          border-radius: 9999px;
          background: linear-gradient(93.06deg, rgba(255, 255, 255, 0) 1%, rgba(203, 203, 203, 0.2) 51.84%, rgba(153, 153, 153, 0) 100%);
          color: rgba(255,255,255,0.85);
          font-weight: 400;
          font-size: 14px;
          backdrop-filter: blur(5.435667037963867px);
          box-shadow: 0px 0px 5.16px 0px #FFFFFF40 inset, 0px 4.07px 6.2px 0px #00000040 inset;
          cursor: pointer;
          transition: opacity 0.2s ease;
          padding: 15px 16px;
          position: relative;
          overflow: hidden;
        }

        .btn-primary-wide::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.3px;
          border-radius: inherit;
          background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .btn-primary-wide::after {
          content: "";
          position: absolute;
          bottom: -17px;
          left: 50%;
          transform: translateX(-50%);
          width: 56%;
          height: 50%;
          background: #7990A5;
          filter: blur(11px);
          opacity: 0.8;
          border-radius: 20%;
          z-index: 0;
          pointer-events: none;
        }

        .btn-primary-wide > span {
          position: relative;
          z-index: 1;
        }

        .btn-primary-wide:hover {
          opacity: 0.9;
        }

        .btn-primary-wide:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {!currentMonth || isLoadingCache ? (
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
              <div className="cal-times-header">
                <h4 className="cal-times-title">
                  {language === 'nl' ? 'Selecteer tijd' : 'Select time'}
                </h4>
                <button 
                  className="time-nav" 
                  onClick={() => scrollTimeStrip('left')}
                  aria-label={language === 'nl' ? 'Vorige tijden' : 'Previous times'}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  className="time-nav" 
                  onClick={() => scrollTimeStrip('right')}
                  aria-label={language === 'nl' ? 'Volgende tijden' : 'Next times'}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              {isSlotsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
                </div>
              ) : availableSlots && availableSlots.length > 0 ? (
                <div 
                  className="time-strip"
                  ref={timeStripRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      className={`time-pill ${selectedTime === slot ? 'is-selected' : ''}`}
                    >
                      <span>{formatTimeSlotWithDuration(slot)}</span>
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
              onClick={handleNext}
              disabled={!selectedDate || !selectedTime || isStaffLoading}
            >
              <span>{language === 'nl' ? 'Volgende' : 'Next'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};