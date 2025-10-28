import { useState } from 'react';
import { ServiceSelector } from './ServiceSelector';
import { DateTimePicker } from './DateTimePicker';
import { CustomerInfoForm } from './CustomerInfoForm';
import { PaymentStep } from './PaymentStep';
import { supabase } from '@/integrations/supabase/client';
import { getServiceConfig } from '@/lib/service-config';
import { toast } from 'sonner';

export type ServiceType = 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult';
export type LocationType = 'online' | 'onsite';

export const BookingWizard = () => {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [bookingIntentId, setBookingIntentId] = useState<string | null>(null);

  const handleServiceSelect = (service: ServiceType, loc: LocationType) => {
    setServiceType(service);
    setLocation(loc);
    setStep(2);
  };

  const handleDateTimeSelect = async (date: string, time: string, staffId: string, staffName: string) => {
    if (!serviceType || !location) return;

    try {
      // Get service configuration
      const config = getServiceConfig(serviceType, location);
      
      // Parse date and time to create appointment datetime
      const [hours, minutes] = time.split(':').map(Number);
      const appointmentDate = new Date(date);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Calculate from_time and to_time in Zoho format (dd-MMM-yyyy HH:mm)
      const formatZohoTime = (d: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = String(d.getDate()).padStart(2, '0');
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hour = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hour}:${min}`;
      };

      const fromTime = formatZohoTime(appointmentDate);
      const toDate = new Date(appointmentDate.getTime() + config.durationMinutes * 60000);
      const toTime = formatZohoTime(toDate);

      // Create booking intent
      const { data, error } = await supabase
        .from('booking_intents')
        .insert({
          service_type: serviceType,
          location: location,
          selected_date: date,
          selected_time: time,
          zoho_service_id: config.serviceId,
          zoho_staff_id: staffId,
          assigned_staff_name: staffName,
          duration_minutes: config.durationMinutes,
          price_euros: config.priceEuros,
          appointment_datetime_utc: appointmentDate.toISOString(),
          from_time: fromTime,
          to_time: toTime,
          timezone: 'Europe/Amsterdam',
          status: 'draft',
          customer_name: '',
          customer_email: '',
          customer_phone: '',
        })
        .select()
        .single();

      if (error) throw error;

      setBookingIntentId(data.id);
      setStep(3);
    } catch (error) {
      console.error('Error creating booking intent:', error);
      toast.error('Failed to proceed. Please try again.');
    }
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

  const handleCustomerInfoComplete = () => {
    setStep(4);
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

      {step === 3 && bookingIntentId && (
        <CustomerInfoForm
          bookingIntentId={bookingIntentId}
          onComplete={handleCustomerInfoComplete}
          onBack={handleBack}
        />
      )}

      {step === 4 && bookingIntentId && (
        <PaymentStep
          bookingIntentId={bookingIntentId}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
