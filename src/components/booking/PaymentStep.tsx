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
    <>
      <style>{`
        .silver-gradient-border {
          position: relative;
        }

        .silver-gradient-border::before {
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

        .silver-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        .button-glow::after {
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
      `}</style>
      <div className="flex flex-col space-y-4 pt-6 border-t border-white/10">
        <button
          onClick={handlePayment}
          disabled={!isFormComplete || isProcessing}
          className="silver-gradient-border button-glow w-full px-4 rounded-full text-white font-inter font-normal transition-all duration-200 text-sm relative overflow-hidden"
          style={{
            background: 'linear-gradient(93.06deg, rgba(255, 255, 255, 0) 1%, rgba(203, 203, 203, 0.2) 51.84%, rgba(153, 153, 153, 0) 100%)',
            backdropFilter: 'blur(5.435667037963867px)',
            boxShadow: '0px 0px 5.16px 0px #FFFFFF40 inset, 0px 4.07px 6.2px 0px #00000040 inset',
            paddingTop: '15px',
            paddingBottom: '15px',
          }}
        >
          <span className="relative z-10">
            {isProcessing 
              ? (language === 'nl' ? 'Even geduld...' : 'Processing...') 
              : (language === 'nl' ? `Betalen €${price.toFixed(2)}` : `Pay €${price.toFixed(2)}`)
            }
            {isTestMode && <span className="ml-2 text-xs opacity-70">(Test modus)</span>}
          </span>
        </button>
        
        {!isFormComplete && (
          <p className="text-xs text-center text-white/50 mt-2">
            {language === 'nl' ? 'Vul alle velden in om te kunnen betalen' : 'Fill in all fields to proceed with payment'}
          </p>
        )}
      </div>
    </>
  );
};