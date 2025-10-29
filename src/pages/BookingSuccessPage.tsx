import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { MetaHead } from '@/components/MetaHead';
import { GlassBackground } from '@/components/haartransplantatie/GlassBackground';
import { GlassHeader } from '@/components/haartransplantatie/GlassHeader';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { nl, enGB as enUS } from 'date-fns/locale';
import { toast } from 'sonner';

export const BookingSuccessPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!sessionId) {
        navigate(language === 'nl' ? '/nl' : '/en');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('booking_intents')
          .select('*')
          .eq('stripe_session_id', sessionId)
          .single();

        if (error) throw error;

        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error(language === 'nl' ? 'Kon reservering niet laden' : 'Could not load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [sessionId, navigate, language]);

  if (loading) {
    return (
      <>
        <MetaHead
          language={language}
          title={language === 'nl' ? 'Laden...' : 'Loading...'}
          description=""
        />
        <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background-start))] to-[hsl(var(--background-end))]">
          <GlassBackground />
          <GlassHeader />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-lg font-inter">
              {language === 'nl' ? 'Laden...' : 'Loading...'}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return null;
  }

  // Format booking ID (last 6 digits of the ID)
  const bookingNumber = booking.id.slice(-6).toUpperCase();
  
  // Format date and time
  const bookingDate = format(new Date(booking.selected_date), 'd MMMM yyyy', { 
    locale: language === 'nl' ? nl : enUS 
  });
  const bookingDateTime = `${bookingDate} om ${booking.selected_time}`;

  return (
    <>
      <MetaHead
        language={language}
        title={language === 'nl' ? 'De eerste stap is gezet' : 'The first step is taken'}
        description={language === 'nl' ? 'Uw afspraak is bevestigd' : 'Your appointment is confirmed'}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex flex-col">
        <GlassBackground />
        <GlassHeader />
        
        {/* Title Section - Upper middle area */}
        <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center font-inter">
            {language === 'nl' ? 'De eerste stap is gezet.' : 'The first step is taken.'}
          </h1>
        </div>

        {/* Content Card - Bottom section */}
        <div className="relative z-10 w-full px-4 pb-8">
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-6 shadow-2xl">
            {/* Booking Number Badge */}
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-1 text-sm font-inter">
                {language === 'nl' ? 'Boeking' : 'Booking'} #{bookingNumber}
              </Badge>
            </div>

            {/* Date and Time */}
            <div className="text-center mb-4">
              <p className="text-white text-xl font-medium font-inter">
                {bookingDateTime}
              </p>
            </div>

            {/* Confirmation Message */}
            <div className="text-center mb-8">
              <p className="text-white/70 text-sm font-inter">
                {language === 'nl' 
                  ? 'Afspraak bevestiging staat in je e-mail' 
                  : 'Appointment confirmation is in your email'}
              </p>
            </div>

            {/* Contact Footer */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/60 text-sm font-inter">
                <a 
                  href="mailto:info@ghihairtransplant.com" 
                  className="hover:text-white transition-colors"
                >
                  info@ghihairtransplant.com
                </a>
                <span className="hidden sm:inline text-white/40">•</span>
                <a 
                  href="tel:+31850606464" 
                  className="hover:text-white transition-colors"
                >
                  +31 85 060 64 64
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
