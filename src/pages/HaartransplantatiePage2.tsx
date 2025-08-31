import { useLayoutEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { ScrollFadeLogo } from '@/components/ScrollFadeLogo';
import { CentralLogo } from '@/components/homepage/CentralLogo';
import { BeforeAfterGrid2 } from '@/components/haartransplantatie2/BeforeAfterGrid2';
import { TreatmentSelectionSection2 } from '@/components/haartransplantatie2/TreatmentSelectionSection2';
import { BottomNavigationPortal2 } from '@/components/haartransplantatie2/BottomNavigationPortal2';
import { DesktopContainer } from '@/components/layout/DesktopContainer';


const HaartransplantatiePage2 = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();
  
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
      <MetaHead language={language} page="haartransplantatie2" />
      <DesktopContainer>
        <PageTransition isNewPage={true}>
          {/* Hero Section - Flex container for stacked items */}
          <section 
            className="w-full relative overflow-hidden flex flex-col"
            style={{ 
              height: 'var(--app-height)'
            }}
          >
            {/* Fading Central Logo - positioned with responsive spacing for smaller screens */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 z-[60] pointer-events-none"
              style={{ 
                top: 'calc(30vh - 40px)' // Closer to text on smaller screens
              }}
            >
              <div className="pointer-events-auto transform scale-125"> {/* Made 25% bigger */}
                <CentralLogo />
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
                <BeforeAfterGrid2 />
              </div>
            </div>

            {/* Bottom Section - Treatment Selection - Flex Grow */}
            <div className="relative z-10 flex-1">
              <div 
                className="page-entry-item page-entry-delay-2 w-full h-full"
                data-page-entry="video"
              >
                <TreatmentSelectionSection2 />
              </div>
            </div>
          </section>

          {/* Bottom Navigation - rendered via portal */}
          <BottomNavigationPortal2 />
        </PageTransition>
      </DesktopContainer>
    </>
  );
};

export default HaartransplantatiePage2;