import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { MetaHead } from '@/components/MetaHead';
import { PopupCloseButton } from '@/components/PopupCloseButton';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { StaffCodePopover } from '@/components/booking/StaffCodePopover';
import { TestModeProvider } from '@/contexts/TestModeContext';

export const BookingPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

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
    setTimeout(() => {
      navigate(language === 'nl' ? '/nl' : '/en');
    }, 350);
  };

  return (
    <>
      <MetaHead
        title={language === 'nl' ? 'Afspraak Boeken - GlobalHair' : 'Book Appointment - GlobalHair'}
        description={language === 'nl' ? 'Boek uw afspraak voor een haartransplantatie consultatie' : 'Book your hair transplant consultation appointment'}
        language={language}
      />
      
      <TestModeProvider>
        <div className={`fixed inset-0 z-50 ${isExiting ? 'reviews-page-exit' : ''}`}>
          <PopupCloseButton
            onClose={handleClose}
            className="!left-auto !right-4"
            style={{ zIndex: 100 }} 
          />
          
          <div className="relative z-10 h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="min-h-screen py-6 px-4">
              <div className={`transition-all duration-700 ease-out max-w-2xl mx-auto ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-[32px] leading-[1.2] font-light text-white mb-6 font-inter">
                  Boek een<br />afspraak
                </h1>
                <BookingWizard />
                
                <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                  <StaffCodePopover onCodeVerified={() => window.location.reload()} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </TestModeProvider>
    </>
  );
};

export default BookingPage;