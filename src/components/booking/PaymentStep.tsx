import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ServiceType, LocationType, BookingSelection, CustomerInfo } from './BookingWizard';
import { getServiceConfig } from '@/lib/service-config';
import { format } from 'date-fns';
import { nl, enGB as enUS } from 'date-fns/locale';
import { useTestMode } from '@/contexts/TestModeContext';
import { Button } from '@/components/ui/button';

interface PaymentStepProps {
  serviceType: ServiceType;
  location: LocationType;
  bookingSelection: {
    date: string;
    time: string;
    staffId: string;
    staffName: string;
    serviceId: string;
    durationMinutes: number;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    notes: string;
  };
  price: number;
}

export const PaymentStep = ({ serviceType, location, bookingSelection, customerInfo, price }: PaymentStepProps) => {
  const { language } = useLanguage();
  const { isTestMode } = useTestMode();
  const [isProcessing, setIsProcessing] = useState(false);

  const config = getServiceConfig(serviceType, location);
  const isFormComplete = customerInfo && customerInfo.name && customerInfo.email && customerInfo.phone && 
                         customerInfo.address && customerInfo.city && customerInfo.country;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      console.log('Creating Stripe checkout session...');

      const { data, error } = await supabase.functions.invoke('stripe-create-checkout', {
        body: {
          serviceType,
          location,
          bookingSelection,
          customerInfo,
          price,
        },
      });

      if (error) throw error;

      if (data.success && data.checkoutUrl) {
        console.log('Redirecting to Stripe checkout...');
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error(language === 'nl' ? 'Betaling kon niet worden gestart. Probeer het opnieuw.' : 'Payment could not be started. Please try again.');
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
      <Button
        onClick={handlePayment}
        disabled={!isFormComplete || isProcessing}
        className="w-full py-6 text-lg font-medium"
      >
        {isProcessing 
          ? (language === 'nl' ? 'Even geduld...' : 'Processing...') 
          : (language === 'nl' ? `Betalen €${price.toFixed(2)}` : `Pay €${price.toFixed(2)}`)
        }
        {isTestMode && <span className="ml-2 text-xs opacity-70">(Test modus)</span>}
      </Button>
      
      {!isFormComplete && (
        <p className="text-xs text-center text-white/50 mt-2">
          {language === 'nl' ? 'Vul alle velden in om te kunnen betalen' : 'Fill in all fields to proceed with payment'}
        </p>
      )}
    </div>
  );
};