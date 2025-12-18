'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SEOHead } from '@/components/SEOHead';
import { PopupCloseButton } from '@/components/PopupCloseButton';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { StaffCodePopover } from '@/components/booking/StaffCodePopover';
import { TestModeProvider } from '@/contexts/TestModeContext';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { trackCustom, isMetaPixelAllowed } from '@/lib/metaPixel';

export const BookingPage = () => {
  const { language } = useLanguage();

  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Staggered animations for entrance
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);

    // Track booking funnel entry
    if (isMetaPixelAllowed()) {
      trackCustom('Booking_Started', {
        content_name: 'Booking Wizard',
        source_url: window.location.href,
      }, { dedupeKey: 'booking_start', oncePerSession: true });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push(language === 'nl' ? '/nl' : '/en');
    }, 350);
  };

  return (
    <>
      <SEOHead
        title={language === 'nl' ? 'Afspraak Boeken' : 'Book Appointment'}
        description={language === 'nl' ? 'Boek uw afspraak voor een haartransplantatie consultatie bij GlobalHair Institute.' : 'Book your hair transplant consultation appointment at GlobalHair Institute.'}
      />

      <TestModeProvider>
        <div className={`fixed inset-0 z-50 ${isExiting ? 'reviews-page-exit' : ''}`}>
          {/* Blur overlay for better text readability */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backdropFilter: 'blur(10.6px)',
              background: 'linear-gradient(180deg, rgba(4, 14, 21, 0.4) 0%, rgba(51, 61, 70, 0.2) 100%)'
            }}
          />

          <PopupCloseButton
            onClose={handleClose}
            className="!left-auto !right-4"
            style={{ zIndex: 100 }}
          />

          <div className="relative z-10 h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="min-h-screen py-6 px-4">
              <DesktopContainer>
                <div
                  className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[100vh]'
                    }`}
                >
                  <h1
                    className="font-inter mb-6 lg:text-center"
                    style={{
                      lineHeight: 1,
                      fontWeight: 400,
                      fontSize: '40px',
                      background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0px 3.39px 18.55px #FFFFFF40'
                    }}
                  >
                    <span className="lg:hidden">Boek een<br />afspraak</span>
                    <span className="hidden lg:inline">Boek een afspraak</span>
                  </h1>
                  <BookingWizard key={refreshKey} />

                  {window.location.hostname.includes('lovable') && (
                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                      <StaffCodePopover onCodeVerified={() => setRefreshKey(prev => prev + 1)} />
                    </div>
                  )}
                </div>
              </DesktopContainer>
            </div>
          </div>
        </div>
      </TestModeProvider>
    </>
  );
};

export default BookingPage;