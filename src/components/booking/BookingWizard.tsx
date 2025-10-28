import { useState } from 'react';
import { ServiceSelector } from './ServiceSelector';
import { DateTimePicker } from './DateTimePicker';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

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

  const testZohoApi = async () => {
    console.log('Testing Zoho API...');
    const { data, error } = await supabase.functions.invoke('zoho-test-simple', {
      body: {},
    });
    
    if (error) {
      console.error('Zoho test error:', error);
      alert('Error: ' + JSON.stringify(error));
    } else {
      console.log('Zoho test response:', data);
      alert('Success! Check console for details.\n\nRaw response: ' + JSON.stringify(data, null, 2));
    }
  };

  return (
    <div className="w-full h-full">
      {/* Test button - temporary for debugging */}
      <div className="fixed top-20 right-4 z-50">
        <Button onClick={testZohoApi} variant="outline" size="sm">
          Test Zoho API
        </Button>
      </div>
      
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
