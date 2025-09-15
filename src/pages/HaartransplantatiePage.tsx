import { useLayoutEffect, useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { ScrollFadeLogo } from '@/components/ScrollFadeLogo';
import { ShieldIcon } from '@/components/logos/ShieldIcon';
import { TreatmentSelectionSection } from '@/components/haartransplantatie/TreatmentSelectionSection';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { VideoBackground } from '@/components/haartransplantatie/VideoBackground';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();
  const [phoneSize, setPhoneSize] = useState<'small' | 'large'>('small');
  
  // Check if user comes from home page
  const isFromHomePage = () => {
    const referrer = document.referrer;
    const currentHost = window.location.origin;
    
    // Check if referrer is from our home page
    return referrer === `${currentHost}/` || 
           referrer === `${currentHost}/nl` || 
           referrer === `${currentHost}/en` ||
           referrer.includes('/nl/') === false && referrer.includes('/en/') === false;
  };
  
  const [comesFromHome] = useState(() => isFromHomePage());

  // Phone size detection for logo positioning - same as component
  useEffect(() => {
    const detectPhoneSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width <= 480 && height > width) { // Portrait mobile devices
        if (width <= 390) {
          setPhoneSize('small'); // iPhone 14, iPhone 13, smaller phones
        } else {
          setPhoneSize('large'); // iPhone 14 Pro Max, iPhone 15 Plus, larger phones
        }
      } else {
        setPhoneSize('large'); // Default for tablets/desktops
      }
      
      console.log('Page logo phone size detected:', width <= 390 ? 'small' : 'large', 'width:', width);
    };

    detectPhoneSize();
    window.addEventListener('resize', detectPhoneSize);
    return () => window.removeEventListener('resize', detectPhoneSize);
  }, []);

  
  // Disable scrolling on mount
  useLayoutEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Disable page scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Re-enable scrolling when leaving the page
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <DesktopContainer>
        <PageTransition isNewPage={true}>
          {/* Full Page Video Background */}
          <VideoBackground />
          
          {/* Hero Section - Flex container for logo and content */}
          <section 
            className="w-full relative overflow-hidden flex flex-col"
            style={{ 
              height: 'var(--app-height)'
            }}
          >
            {/* Central Logo at top */}
            <div 
              className={`w-full relative z-[100] pointer-events-none flex justify-center pt-8 ${comesFromHome ? 'opacity-0 animate-logo-entrance' : 'opacity-100'}`}
              style={{ 
                ...(comesFromHome ? { animationDelay: '0ms' } : {})
              }}
            >
              <div 
                className="pointer-events-none" 
                style={{ 
                  width: '280px', 
                  height: '280px'
                }}
              >
                <ShieldIcon />
              </div>
            </div>

            {/* Treatment Selection Section - Flex Grow */}
            <div className="relative z-20 flex-1">
              <div 
                className="page-entry-item page-entry-delay-2 w-full h-full"
                data-page-entry="video"
              >
                <TreatmentSelectionSection />
              </div>
            </div>
          </section>

          {/* Bottom Navigation - rendered via portal */}
          <BottomNavigationPortal />
        </PageTransition>
      </DesktopContainer>
    </>
  );
};

export default HaartransplantatiePage;