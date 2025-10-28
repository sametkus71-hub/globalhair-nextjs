import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { GlassBackground } from '@/components/haartransplantatie/GlassBackground';
import { BookingWizard } from '@/components/booking/BookingWizard';

export const BookingPage = () => {
  const { language } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);
  const { handlePopupClose } = usePopupClose();

  // Staggered animations for entrance
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(350);
  };

  return (
    <>
      <MetaHead
        title={language === 'nl' ? 'Afspraak Boeken - GlobalHair' : 'Book Appointment - GlobalHair'}
        description={language === 'nl' ? 'Boek uw afspraak voor een haartransplantatie consultatie' : 'Book your hair transplant consultation appointment'}
        language={language}
      />
      
      <div className={`fixed inset-0 z-50 ${isExiting ? 'reviews-page-exit' : ''}`}>
        <GlassBackground />
        
        <PopupCloseButton 
          onClose={handleClose} 
          style={{ zIndex: 100 }} 
        />
        
        <div className="relative z-10 h-screen overflow-y-auto">
          <div className="min-h-screen py-8 px-4">
            <div className={`transition-all duration-700 ease-out max-w-5xl mx-auto ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-5xl md:text-6xl font-light text-white mb-8 text-center leading-tight">
                Boek een<br />afspraak
              </h1>
              <BookingWizard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingPage;