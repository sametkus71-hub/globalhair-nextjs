import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { nl, enGB } from 'date-fns/locale';
import { toast } from 'sonner';

interface PaymentStepProps {
  bookingIntentId: string;
  onBack: () => void;
}

export const PaymentStep = ({ bookingIntentId, onBack }: PaymentStepProps) => {
  const { language } = useLanguage();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadBookingData();
  }, [bookingIntentId]);

  const loadBookingData = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_intents')
        .select('*')
        .eq('id', bookingIntentId)
        .single();

      if (error) throw error;
      setBookingData(data);
    } catch (error) {
      console.error('Error loading booking data:', error);
      toast.error(language === 'nl' ? 'Kon boeking niet laden' : 'Could not load booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Update status to pending_confirmation
      const { error: updateError } = await supabase
        .from('booking_intents')
        .update({ status: 'pending_confirmation' })
        .eq('id', bookingIntentId);

      if (updateError) throw updateError;

      // Call Zoho booking API
      const { data, error } = await supabase.functions.invoke('zoho-create-booking', {
        body: { booking_intent_id: bookingIntentId },
      });

      if (error) throw error;

      if (data.success) {
        toast.success(language === 'nl' ? 'Afspraak bevestigd!' : 'Appointment confirmed!');
        // Redirect or show success
      } else {
        throw new Error(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(language === 'nl' ? 'Betaling mislukt' : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-white/70">{language === 'nl' ? 'Boeking niet gevonden' : 'Booking not found'}</p>
      </div>
    );
  }

  const appointmentDate = new Date(bookingData.selected_date);
  const formattedDate = format(appointmentDate, 'EEEE d MMMM yyyy', {
    locale: language === 'nl' ? nl : enGB,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
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
          <div className="flex justify-between">
            <span className="text-white/70">{language === 'nl' ? 'Service' : 'Service'}:</span>
            <span className="text-white font-medium">
              {bookingData.service_type.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">{language === 'nl' ? 'Locatie' : 'Location'}:</span>
            <span className="text-white font-medium">
              {bookingData.location === 'online' 
                ? (language === 'nl' ? 'Online' : 'Online')
                : (language === 'nl' ? 'Op locatie' : 'On-site')}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">{language === 'nl' ? 'Datum' : 'Date'}:</span>
            <span className="text-white font-medium">{formattedDate}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">{language === 'nl' ? 'Tijd' : 'Time'}:</span>
            <span className="text-white font-medium">{bookingData.selected_time}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">{language === 'nl' ? 'Specialist' : 'Specialist'}:</span>
            <span className="text-white font-medium">{bookingData.assigned_staff_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">{language === 'nl' ? 'Duur' : 'Duration'}:</span>
            <span className="text-white font-medium">{bookingData.duration_minutes} min</span>
          </div>

          <div className="border-t border-white/20 pt-4 mt-4">
            <div className="flex justify-between text-lg">
              <span className="text-white font-semibold">{language === 'nl' ? 'Totaal' : 'Total'}:</span>
              <span className="text-white font-bold">€{bookingData.price_euros}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-white/20 hover:bg-white/30 text-white"
        >
          {isProcessing
            ? (language === 'nl' ? 'Bezig met bevestigen...' : 'Confirming...')
            : (language === 'nl' ? 'Bevestig en betaal' : 'Confirm and pay')}
        </Button>
      </div>
    </div>
  );
};
