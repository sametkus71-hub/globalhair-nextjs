import { useLayoutEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { ScrollFadeLogo } from '@/components/ScrollFadeLogo';
import { CentralLogo } from '@/components/homepage/CentralLogo';
import { BeforeAfterGrid } from '@/components/haartransplantatie/BeforeAfterGrid';
import { VideoPlaySection } from '@/components/haartransplantatie/VideoPlaySection';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { DesktopContainer } from '@/components/layout/DesktopContainer';


const HaartransplantatiePage = () => {
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
      <MetaHead language={language} page="haartransplantatie" />
      <DesktopContainer>
        <PageTransition isNewPage={true}>
          {/* Hero Section - Above the fold only */}
          <section 
            className="min-h-[var(--app-height)] w-full relative overflow-hidden"
            style={{ 
              height: `${height}px`
            }}
          >
            {/* Fading Central Logo - positioned at grid boundary */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 z-[60] pointer-events-none"
              style={{ 
                top: `calc(40vh - 75px)`
              }}
            >
              <div className="pointer-events-auto">
                <CentralLogo />
              </div>
            </div>
            
            {/* Top Section - Before/After Grid */}
            <div 
              className="relative z-10"
              style={{ 
                height: `${height * 0.40}px`
              }}
            >
              <div 
                className="page-entry-grid page-entry-delay-1 w-full h-full"
                data-page-entry="grid"
              >
                <BeforeAfterGrid />
              </div>
            </div>

            {/* Bottom Section - Video Play & Controls */}
            <div 
              className="relative z-10"
              style={{ 
                height: `${height * 0.60}px`
              }}
            >
              <div 
                className="page-entry-item page-entry-delay-2 w-full h-full"
                data-page-entry="video"
              >
                <VideoPlaySection />
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