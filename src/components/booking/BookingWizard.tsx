import { useState } from 'react';
import { ServiceSelector } from './ServiceSelector';
import { DateTimePicker } from './DateTimePicker';

export type ServiceType = 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult';
export type LocationType = 'online' | 'onsite';

export const BookingWizard = () => {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleServiceSelect = (service: ServiceType, loc: LocationType) => {
    setServiceType(service);
    setLocation(loc);
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    // Step 3 will be customer form + payment (later)
    console.log('Selected:', { serviceType, location, date, time });
  };

  const handleBack = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <div className="w-full h-full">
      {step === 1 && (
        <ServiceSelector onSelect={handleServiceSelect} />
      )}
      
      {step === 2 && serviceType && location && (
        <DateTimePicker
          serviceType={serviceType}
          location={location}
          onSelect={handleDateTimeSelect}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
