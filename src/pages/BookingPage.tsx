import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';

export const BookingPage = () => {
  const { language } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);
  const { handlePopupClose } = usePopupClose();

  // Staggered animations for entrance
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Trigger entrance animations
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = 'unset';
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(300);
  };

  return (
    <>
      <MetaHead
        title={language === 'nl' ? 'Afspraak Boeken - GlobalHair' : 'Book Appointment - GlobalHair'}
        description={language === 'nl' ? 'Boek uw afspraak voor een haartransplantatie consultatie' : 'Book your hair transplant consultation appointment'}
        language={language}
      />
      
      <div className={`booking-page-fullscreen ${isExiting ? 'booking-page-exit' : ''}`}>
        {/* Close button with maximum z-index to stay above iframe */}
        <PopupCloseButton 
          onClose={handleClose} 
          style={{ zIndex: 2147483647 }} 
        />
        
        <div className="flex flex-col items-center justify-start h-screen px-4 pt-16 pb-8 overflow-hidden bg-black">
          
          {/* Title */}
          <div className={`text-center mb-8 transition-all duration-700 ease-out ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
              {language === 'nl' ? 'Afspraak Boeken' : 'Book Appointment'}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {language === 'nl' 
                ? 'Plan uw persoonlijke consultatie voor een haartransplantatie'
                : 'Schedule your personal hair transplant consultation'
              }
            </p>
          </div>

          {/* Booking iframe container */}
          <div className={`w-full max-w-4xl mx-auto transition-all duration-700 ease-out delay-200 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
              {/* Placeholder content - will be replaced with iframe */}
              <div className="h-[600px] flex items-center justify-center text-white/60">
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-white/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">
                    {language === 'nl' ? 'Booking widget wordt geladen...' : 'Booking widget loading...'}
                  </p>
                  <p className="text-sm opacity-75">
                    {language === 'nl' 
                      ? 'Deze ruimte wordt gevuld met de booking iframe'
                      : 'This space will be filled with the booking iframe'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BookingPage;