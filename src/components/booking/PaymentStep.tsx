import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ServiceType, LocationType, BookingSelection, CustomerInfo } from './BookingWizard';
import { getServiceConfig } from '@/lib/service-config';
import { format } from 'date-fns';
import { nl, enGB as enUS } from 'date-fns/locale';

interface PaymentStepProps {
  serviceType: ServiceType;
  location: LocationType;
  bookingSelection: {
    date: string;
    time: string;
    staffId: string;
    staffName: string;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  price: number;
}

export const PaymentStep = ({ serviceType, location, bookingSelection, customerInfo, price }: PaymentStepProps) => {
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const config = getServiceConfig(serviceType, location);

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

  // Calculate end time for display
  const [hours, minutes] = bookingSelection.time.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(hours, minutes + config.durationMinutes, 0, 0);
  const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="flex flex-col space-y-6 pt-6 border-t border-white/10">
      {/* Booking Summary */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-white/90">
          {language === 'nl' ? 'Bevestig en betaal' : 'Confirm and pay'}
        </h3>

        <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">{language === 'nl' ? 'Service' : 'Service'}:</span>
            <span className="text-white font-medium">
              {serviceType === 'v6_hairboost' && (language === 'nl' ? 'V6 Hairboost' : 'V6 Hairboost')}
              {serviceType === 'haartransplantatie' && (language === 'nl' ? 'Haartransplantatie' : 'Hair Transplant')}
              {serviceType === 'ceo_consult' && (language === 'nl' ? 'CEO Consultatie' : 'CEO Consultation')}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-white/60">{language === 'nl' ? 'Locatie' : 'Location'}:</span>
            <span className="text-white font-medium">
              {location === 'online' ? (language === 'nl' ? 'Online' : 'Online') : (language === 'nl' ? 'Op locatie' : 'On-site')}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-white/60">{language === 'nl' ? 'Datum' : 'Date'}:</span>
            <span className="text-white font-medium">
              {format(new Date(bookingSelection.date), 'EEEE, d MMMM yyyy', { locale: language === 'nl' ? nl : enUS })}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-white/60">{language === 'nl' ? 'Tijd' : 'Time'}:</span>
            <span className="text-white font-medium">
              {bookingSelection.time} - {endTime}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-white/60">{language === 'nl' ? 'Specialist' : 'Specialist'}:</span>
            <span className="text-white font-medium">{bookingSelection.staffName}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-white/60">{language === 'nl' ? 'Duur' : 'Duration'}:</span>
            <span className="text-white font-medium">{config.durationMinutes} {language === 'nl' ? 'minuten' : 'minutes'}</span>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between">
            <span className="text-white font-medium">{language === 'nl' ? 'Totaal' : 'Total'}:</span>
            <span className="text-white text-2xl font-bold">€{price}</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-all duration-200 disabled:opacity-50 shadow-lg text-base"
      >
        {isProcessing 
          ? (language === 'nl' ? 'Bezig met verwerken...' : 'Processing...') 
          : (language === 'nl' ? 'Betalen' : 'Pay')
        }
      </button>
    </div>
  );
};