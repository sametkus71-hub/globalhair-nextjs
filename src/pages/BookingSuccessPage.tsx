import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
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
        <SEOHead
          title={language === 'nl' ? 'Laden...' : 'Loading...'}
          description=""
          noIndex={true}
        />
        <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background-start))] to-[hsl(var(--background-end))]">
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

  // Format booking ID (last 6 digits of the ID for traceability in database)
  const bookingNumber = booking.id.slice(-6).toUpperCase();
  
  // Format date and time (HH:mm format without seconds)
  const bookingDate = format(new Date(booking.selected_date), 'd MMMM yyyy', { 
    locale: language === 'nl' ? nl : enUS 
  });
  // Format time as HH:mm only (remove seconds)
  const timeWithoutSeconds = booking.selected_time.substring(0, 5);
  const bookingDateTime = `${bookingDate} om ${timeWithoutSeconds}`;

  return (
    <>
      <SEOHead
        title={language === 'nl' ? 'Afspraak Bevestigd' : 'Appointment Confirmed'}
        description={language === 'nl' ? 'Uw afspraak bij GlobalHair Institute is bevestigd.' : 'Your appointment at GlobalHair Institute is confirmed.'}
        noIndex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex flex-col">
        <GlassHeader />
        
        {/* Title Section - Upper middle area */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 pt-4 pb-16">
          <div className="w-full max-w-2xl">
            <h1 
              className="leading-none font-normal tracking-[-0.04em] text-left font-inter bg-clip-text text-transparent pb-2"
              style={{
                fontSize: '56px',
                background: 'linear-gradient(124.01deg, rgba(255, 255, 255, 0.5) 4.17%, #FFFFFF 37.36%, #FFFFFF 70.56%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'nl' ? 'De eerste stap is gezet.' : 'The first step is taken.'}
            </h1>
          </div>
        </div>

        {/* Content Card - Bottom section */}
        <div className="relative z-10 w-full px-4 pb-6">
          <div className="step-gradient-border max-w-2xl mx-auto rounded-xl bg-white/5 overflow-hidden border-b-0 p-6 pb-8" style={{
            backdropFilter: 'blur(1.6044442653656006px)',
            boxShadow: '0px 4.01px 8.72px 0px #00000040 inset, 0px -1px 4.71px 0px #FFFFFF40 inset, 0px 3.01px 1px 0px #00000040'
          }}>
            {/* Booking Number Badge */}
            <div className="flex justify-center mb-5">
            <Badge variant="secondary" className="bg-white/10 border border-white rounded-full px-2.5 py-1 font-light font-inter" style={{ 
              fontSize: '10px',
              background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, rgb(255, 255, 255) 39.54%, rgb(255, 255, 255) 79.72%) text',
              WebkitTextFillColor: 'transparent'
            }}>
              {language === 'nl' ? 'Boeking' : 'Booking'} #{bookingNumber}
            </Badge>
            </div>

            {/* Date and Time */}
            <div className="text-center mb-1">
              <p className="font-inter" style={{ fontSize: '22px', color: '#DBDBDB', fontWeight: 300 }}>
                {bookingDateTime}
              </p>
            </div>

            {/* Confirmation Message */}
            <div className="text-center">
              <p className="font-inter" style={{ fontSize: '15px', color: '#DBDBDB', fontWeight: 300 }}>
                {language === 'nl' 
                  ? 'Afspraak bevestiging staat in je e-mail' 
                  : 'Appointment confirmation is in your email'}
              </p>
            </div>
          </div>
          
          {/* Contact Info - Outside container */}
          <div className="max-w-2xl mx-auto flex items-center justify-between mt-6 px-2">
            <a 
              href="mailto:Contact@globalhair.nl" 
              className="text-[13.69px] leading-none tracking-[-0.04em] text-center font-normal font-inter bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              style={{
                background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Contact@globalhair.nl
            </a>
            <a 
              href="tel:0857500577" 
              className="text-[13.69px] leading-none tracking-[-0.04em] text-center font-normal font-inter bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              style={{
                background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              085 750 0577
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .step-gradient-border {
          position: relative;
        }

        .step-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(269.87deg, #4B555E 3.18%, #ACB9C1 51.79%, #FFFFFF 76.09%, #ACB9C1 88.24%, #4B555E 100.39%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .step-gradient-border > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
};
