import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ServiceType, LocationType, BookingSelection, CustomerInfo } from './BookingWizard';
import { getServiceConfig } from '@/lib/service-config';
import { format } from 'date-fns';
import { nl, enGB } from 'date-fns/locale';

interface PaymentStepProps {
  serviceType: ServiceType;
  location: LocationType;
  bookingSelection: BookingSelection;
  customerInfo: CustomerInfo;
  onBack: () => void;
}

export const PaymentStep = ({
  serviceType,
  location,
  bookingSelection,
  customerInfo,
  onBack
}: PaymentStepProps) => {
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const config = getServiceConfig(serviceType, location);

  const serviceNames = {
    v6_hairboost: language === 'nl' ? 'V6 Hairboost Consult' : 'V6 Hairboost Consultation',
    haartransplantatie: language === 'nl' ? 'Haartransplantatie Consult' : 'Hair Transplant Consultation',
    ceo_consult: language === 'nl' ? 'CEO Consult' : 'CEO Consultation',
  };

  const locationNames = {
    online: language === 'nl' ? 'Online' : 'Online',
    onsite: language === 'nl' ? 'Op locatie' : 'On-site',
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Parse date and time to create appointment datetime
      const [hours, minutes] = bookingSelection.time.split(':').map(Number);
      const appointmentDate = new Date(bookingSelection.date);
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

      // CREATE BOOKING INTENT NOW
      const { data: bookingIntent, error: insertError } = await supabase
        .from('booking_intents')
        .insert({
          service_type: serviceType,
          location: location,
          selected_date: bookingSelection.date,
          selected_time: bookingSelection.time,
          zoho_service_id: config.serviceId,
          zoho_staff_id: bookingSelection.staffId,
          assigned_staff_name: bookingSelection.staffName,
          duration_minutes: config.durationMinutes,
          price_euros: config.priceEuros,
          appointment_datetime_utc: appointmentDate.toISOString(),
          from_time: fromTime,
          to_time: toTime,
          timezone: 'Europe/Amsterdam',
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          booking_notes: customerInfo.notes || null,
          status: 'pending_confirmation',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Now call Zoho booking API
      const { data, error } = await supabase.functions.invoke('zoho-create-booking', {
        body: { booking_intent_id: bookingIntent.id },
      });

      if (error) throw error;

      if (data.success) {
        toast.success(language === 'nl' ? 'Afspraak bevestigd!' : 'Appointment confirmed!');
        // TODO: Redirect to success page or show success message
      } else {
        throw new Error(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(language === 'nl' ? 'Betaling mislukt. Probeer het opnieuw.' : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format appointment date for display
  const appointmentDateObj = new Date(bookingSelection.date);
  const formattedDate = format(appointmentDateObj, 'EEEE d MMMM yyyy', {
    locale: language === 'nl' ? nl : enGB,
  });

  // Calculate end time for display
  const [hours, minutes] = bookingSelection.time.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(hours, minutes + config.durationMinutes, 0, 0);
  const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'nl' ? 'Terug' : 'Back'}
        </button>
      </div>

      <div className="flex-1 px-4 pb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {language === 'nl' ? 'Bevestig je afspraak' : 'Confirm your appointment'}
        </h2>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4 mb-6">
          <div>
            <p className="text-sm text-white/60">{language === 'nl' ? 'Service' : 'Service'}</p>
            <p className="text-lg font-medium text-white">{serviceNames[serviceType]}</p>
          </div>

          <div>
            <p className="text-sm text-white/60">{language === 'nl' ? 'Locatie' : 'Location'}</p>
            <p className="text-lg font-medium text-white">{locationNames[location]}</p>
          </div>

          <div>
            <p className="text-sm text-white/60">{language === 'nl' ? 'Datum' : 'Date'}</p>
            <p className="text-lg font-medium text-white">{formattedDate}</p>
          </div>

          <div>
            <p className="text-sm text-white/60">{language === 'nl' ? 'Tijd' : 'Time'}</p>
            <p className="text-lg font-medium text-white">
              {bookingSelection.time} - {endTime}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/60">{language === 'nl' ? 'Specialist' : 'Specialist'}</p>
            <p className="text-lg font-medium text-white">{bookingSelection.staffName}</p>
          </div>

          <div>
            <p className="text-sm text-white/60">{language === 'nl' ? 'Duur' : 'Duration'}</p>
            <p className="text-lg font-medium text-white">
              {config.durationMinutes} {language === 'nl' ? 'minuten' : 'minutes'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/20">
            <p className="text-sm text-white/60">{language === 'nl' ? 'Totaal' : 'Total'}</p>
            <p className="text-2xl font-bold text-white">€{config.priceEuros}</p>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-white/20 hover:bg-white/30 text-white"
        >
          {isProcessing
            ? (language === 'nl' ? 'Bezig met bevestigen...' : 'Confirming...')
            : (language === 'nl' ? 'Betalen en bevestigen' : 'Pay and confirm')}
        </Button>
      </div>
    </div>
  );
};
