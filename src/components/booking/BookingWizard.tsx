import { useState } from 'react';
import { ServiceSelector } from './ServiceSelector';
import { DateTimePicker } from './DateTimePicker';
import { CustomerInfoForm } from './CustomerInfoForm';
import { PaymentStep } from './PaymentStep';

export type ServiceType = 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult';
export type LocationType = 'online' | 'onsite';

export interface BookingSelection {
  date: string;
  time: string;
  staffId: string;
  staffName: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export const BookingWizard = () => {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [bookingSelection, setBookingSelection] = useState<BookingSelection | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const handleServiceSelect = (service: ServiceType, loc: LocationType) => {
    setServiceType(service);
    setLocation(loc);
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string, staffId: string, staffName: string) => {
    setBookingSelection({ date, time, staffId, staffName });
    setStep(3);
  };

  const handleCustomerInfoComplete = (info: CustomerInfo) => {
    setCustomerInfo(info);
    setStep(4);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
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

      {step === 3 && (
        <CustomerInfoForm
          onComplete={handleCustomerInfoComplete}
          onBack={handleBack}
        />
      )}

      {step === 4 && serviceType && location && bookingSelection && customerInfo && (
        <PaymentStep
          serviceType={serviceType}
          location={location}
          bookingSelection={bookingSelection}
          customerInfo={customerInfo}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
