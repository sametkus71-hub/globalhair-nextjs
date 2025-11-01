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
    postcode: string;
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
                         customerInfo.postcode && customerInfo.city && customerInfo.country;

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
    <div className="flex flex-col space-y-4 pt-6 border-t border-white/10">
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