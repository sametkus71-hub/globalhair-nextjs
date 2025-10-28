import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { MetaHead } from '@/components/MetaHead';
import { GlassBackground } from '@/components/haartransplantatie/GlassBackground';
import { format } from 'date-fns';
import { nl, enGB as enUS } from 'date-fns/locale';
import { Check, Calendar, Clock, MapPin, User } from 'lucide-react';
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
        <div className="min-h-screen bg-[hsl(var(--background-start))] flex items-center justify-center">
          <GlassBackground />
          <div className="text-white text-lg">
            {language === 'nl' ? 'Laden...' : 'Loading...'}
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return null;
  }

  const serviceName = booking.service_type === 'v6_hairboost' 
    ? 'V6 Hairboost Consult'
    : booking.service_type === 'haartransplantatie'
    ? 'Haartransplantatie Consult'
    : 'CEO Consultatie';

  const locationName = booking.location === 'online' 
    ? (language === 'nl' ? 'Online' : 'Online')
    : (language === 'nl' ? 'Op locatie' : 'On-site');

  return (
    <>
      <MetaHead
        language={language}
        title={language === 'nl' ? 'Afspraak Bevestigd' : 'Appointment Confirmed'}
        description={language === 'nl' ? 'Uw afspraak is bevestigd' : 'Your appointment is confirmed'}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex items-center justify-center p-4">
        <GlassBackground />
        
        <div className="relative z-10 w-full max-w-2xl">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white text-center mb-2 font-inter">
              {language === 'nl' ? 'Afspraak Bevestigd!' : 'Appointment Confirmed!'}
            </h1>
            
            <p className="text-white/60 text-center mb-8 text-sm font-inter">
              {language === 'nl' 
                ? 'U ontvangt een bevestigingsmail op' 
                : 'You will receive a confirmation email at'
              } {booking.customer_email}
            </p>

            {/* Booking Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <User className="w-5 h-5 text-white/60 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-white/60 mb-1 font-inter">{language === 'nl' ? 'Service' : 'Service'}</div>
                  <div className="text-white font-medium font-inter">{serviceName}</div>
                  <div className="text-sm text-white/70 font-inter">{booking.assigned_staff_name}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <Calendar className="w-5 h-5 text-white/60 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-white/60 mb-1 font-inter">{language === 'nl' ? 'Datum' : 'Date'}</div>
                  <div className="text-white font-medium font-inter">
                    {format(new Date(booking.selected_date), 'EEEE, d MMMM yyyy', { 
                      locale: language === 'nl' ? nl : enUS 
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <Clock className="w-5 h-5 text-white/60 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-white/60 mb-1 font-inter">{language === 'nl' ? 'Tijd' : 'Time'}</div>
                  <div className="text-white font-medium font-inter">
                    {booking.selected_time} ({booking.duration_minutes} {language === 'nl' ? 'minuten' : 'minutes'})
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <MapPin className="w-5 h-5 text-white/60 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-white/60 mb-1 font-inter">{language === 'nl' ? 'Locatie' : 'Location'}</div>
                  <div className="text-white font-medium font-inter">{locationName}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(language === 'nl' ? '/nl' : '/en')}
                className="flex-1 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-all duration-200 text-sm font-inter"
              >
                {language === 'nl' ? 'Terug naar home' : 'Back to home'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
