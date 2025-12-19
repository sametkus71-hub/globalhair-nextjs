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
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';
import logoIcon from '@/assets/logo-icon.png';
import Image from 'next/image';

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
        {/* Root wrapper - strictly for positioning, no movement to avoid double-container issues */}
        <div className={`fixed inset-0 z-[9999] ${isExiting ? 'reviews-page-exit' : ''}`}>

          {/* 1. Background Layer - FADES IN ONLY, DOES NOT MOVE */}
          <div
            className={`absolute inset-0 z-0 transition-opacity duration-700 ease-out ${titleVisible && !isExiting ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              backdropFilter: 'blur(10.6px)',
              background: 'linear-gradient(180deg, rgba(4, 14, 21, 0.4) 0%, rgba(51, 61, 70, 0.2) 100%)',
              pointerEvents: 'none' // Click through to whatever is behind if needed, usually block though
            }}
          />

          {/* 2. Logo - Desktop (top left) */}
          <div
            className={`hidden lg:block absolute top-6 left-6 transition-opacity duration-700 delay-100 ${titleVisible && !isExiting ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ zIndex: 100 }}
          >
            <Image
              src={hairtransplantLogo}
              alt="GlobalHair Institute"
              width={180}
              height={40}
              priority
            />
          </div>

          {/* 3. Close Button - Fades in */}
          <PopupCloseButton
            onClose={handleClose}
            className={`!left-auto !right-4 transition-opacity duration-700 delay-200 ${titleVisible && !isExiting ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ zIndex: 100 }}
          />

          {/* 3. Content Wrapper - Handles the SLIDE UP animation independently */}
          <div className="relative z-10 h-screen overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="min-h-screen py-6 px-4">
              <DesktopContainer>
                {/* The distinct content slide from bottom */}
                <div
                  className={`transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${titleVisible && !isExiting ? 'translate-y-0 opacity-100' : 'translate-y-[100vh] opacity-0'
                    }`}
                >
                  {/* Mobile: Icon + Title */}
                  <div className="lg:hidden flex items-center gap-3 mb-6">
                    <Image
                      src={logoIcon}
                      alt="GlobalHair"
                      width={32}
                      height={32}
                      priority
                    />
                    <h1
                      className="font-inter"
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
                      Boek een<br />afspraak
                    </h1>
                  </div>

                  {/* Desktop: Title only (logo is in top left) */}
                  <h1
                    className="hidden lg:block font-inter mb-6 text-center"
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
                    Boek een afspraak
                  </h1>
                  <BookingWizard key={refreshKey} />

                  <StaffCodePopover onCodeVerified={() => setRefreshKey(prev => prev + 1)} />
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