'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { GlassHeader } from '@/components/haartransplantatie/GlassHeader';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { nl, enGB as enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import { trackStandard, trackCustom, isMetaPixelAllowed } from '@/lib/metaPixel';

export const BookingSuccessPage = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [debugError, setDebugError] = useState<string>('');
  const conversionTrackedRef = useRef(false);

  useEffect(() => {
    const fetchAndProcessBooking = async () => {
      if (!sessionId) {
        router.push(language === 'nl' ? '/nl' : '/en');
        return;
      }

      try {
        // Attempt to fetch via client (might fail due to RLS)
        let bookingData = null;
        const { data, error } = await supabase
          .from('booking_intents')
          .select('*')
          .eq('stripe_session_id', sessionId)
          .maybeSingle();

        if (data) {
          bookingData = data;
        } else {
          console.log('Client-side fetch returned no data (likely RLS), proceeding to Edge Function...');
        }

        // If we don't have data, OR if the status needs processing, call the Edge Function
        // The Edge Function runs as Service Role so it can always find the booking
        if (!bookingData || bookingData.status === 'pending' || bookingData.status === 'paid') {
          setProcessing(true);
          console.log('Invoking process-booking function...');

          const { data: processResult, error: processError } = await supabase.functions.invoke('process-booking', {
            body: { stripe_session_id: sessionId }
          });

          if (processError) {
            console.error('Error invoking process-booking:', processError);
            if (bookingData) {
              setBooking(bookingData); // Fallback to what we have if any
            } else {
              setDebugError(processError.message || JSON.stringify(processError));
              throw processError; // Real error if we have nothing
            }
          } else if (processResult?.booking) {
            console.log('Booking returned from Edge Function:', processResult.booking.status);
            setBooking(processResult.booking);
            bookingData = processResult.booking; // Update local ref for tracking

            // Track conversion event logic...
            if (processResult.booking.status === 'confirmed' || processResult.booking.status === 'paid') {
              if (!conversionTrackedRef.current && isMetaPixelAllowed()) {
                conversionTrackedRef.current = true;
                const eventID = `booking_${sessionId}_${Date.now()}`;
                const bookingId = processResult.booking.id?.slice(-6).toUpperCase() || '';

                trackStandard('Purchase', {
                  content_name: 'Hair Consultation Booking',
                  content_category: 'Booking',
                  value: processResult.booking.price_euros || 0,
                  currency: 'EUR',
                  eventID,
                }, { dedupeKey: `purchase_${sessionId}`, oncePerSession: true });

                trackCustom('Booking_Completed', {
                  booking_id: bookingId,
                  service_type: processResult.booking.service_type,
                  eventID,
                }, { dedupeKey: `booking_complete_${sessionId}`, oncePerSession: true });
              }
            }
          } else if (processResult?.error) {
            console.error('Edge function returned logical error:', processResult.error);
            setDebugError(processResult.error);
            toast.error(processResult.error);
            if (bookingData) setBooking(bookingData);
          }
          setProcessing(false);
        } else {
          // We have data and it's already confirmed/completed
          setBooking(bookingData);
        }
      } catch (error: any) {
        console.error('Error in booking flow:', error);
        setDebugError(error.message || JSON.stringify(error));
        toast.error(language === 'nl' ? 'Kon reservering niet laden' : 'Could not load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessBooking();
  }, [sessionId, router, language]);

  if (loading || processing) {
    return (
      <>
        <SEOHead
          title={language === 'nl' ? 'Verwerken...' : 'Processing...'}
          description=""
          noIndex={true}
        />
        <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background-start))] to-[hsl(var(--background-end))]">
          <GlassHeader />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-lg font-inter text-center">
              <div className="mb-2">
                {processing
                  ? (language === 'nl' ? 'Afspraak wordt verwerkt...' : 'Processing your appointment...')
                  : (language === 'nl' ? 'Laden...' : 'Loading...')
                }
              </div>
              {processing && (
                <div className="text-sm text-white/60">
                  {language === 'nl' ? 'Even geduld alstublieft' : 'Please wait a moment'}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex flex-col">
        <GlassHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-white text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">
              {language === 'nl' ? 'Kan reservering niet laden' : 'Unable to load booking'}
            </h2>
            <p className="text-white/60 mb-4">
              {language === 'nl'
                ? 'Er is een fout opgetreden bij het ophalen van uw gegevens.'
                : 'An error occurred while fetching your data.'}
            </p>
            {debugError && (
              <div className="bg-black/30 p-4 rounded text-left mb-4 overflow-auto max-h-40">
                <p className="text-xs text-red-300 font-mono break-all leading-relaxed">
                  Debug: {debugError}
                </p>
              </div>
            )}
            <p className="text-xs text-white/30 font-mono mb-4">
              Session ID: {sessionId?.slice(0, 10)}...
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
            >
              {language === 'nl' ? 'Opnieuw proberen' : 'Try again'}
            </button>
          </div>
        </div>
      </div>
    );
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
