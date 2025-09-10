import { useLayoutEffect, useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { ScrollFadeLogo } from '@/components/ScrollFadeLogo';
import { ShieldIcon } from '@/components/logos/ShieldIcon';
import { BeforeAfterGrid } from '@/components/haartransplantatie/BeforeAfterGrid';
import { TreatmentSelectionSection } from '@/components/haartransplantatie/TreatmentSelectionSection';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { VideoBackground } from '@/components/haartransplantatie/VideoBackground';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();
  const [phoneSize, setPhoneSize] = useState<'small' | 'large'>('small');

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

  // Dynamic logo positioning - overlapping with top grid
  const getLogoPosition = () => {
    return '15vh'; // Even higher to overlap significantly with the top grid
  };
  
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
          
          {/* Hero Section - Flex container for stacked items */}
          <section 
            className="w-full relative overflow-hidden flex flex-col"
            style={{ 
              height: 'var(--app-height)'
            }}
          >
            {/* Fading Central Logo - positioned with phone size detection */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 z-[50] pointer-events-none"
              style={{ 
                top: getLogoPosition() // Dynamic positioning based on phone size detection
              }}
            >
              <div className="pointer-events-none" style={{ width: '280px', height: '280px' }}> {/* 280px */}
                <ShieldIcon />
              </div>
            </div>
            
            {/* Top Section - Before/After Grid - Fixed Height */}
            <div 
              className="relative z-10 flex-shrink-0"
              style={{ 
                height: '40vh'
              }}
            >
              <div 
                className="page-entry-grid page-entry-delay-1 w-full h-full"
                data-page-entry="grid"
              >
                <BeforeAfterGrid />
              </div>
            </div>

            {/* Bottom Section - Treatment Selection - Flex Grow */}
            <div className="relative z-10 flex-1">
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