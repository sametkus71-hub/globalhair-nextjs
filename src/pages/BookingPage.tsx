import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
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
        
        <div className="relative z-10 h-screen overflow-hidden">
          <div className={`transition-all duration-700 ease-out ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <BookingWizard />
          </div>
        </div>
      </div>
      <BottomNavigationPortal />
    </>
  );
};

export default BookingPage;