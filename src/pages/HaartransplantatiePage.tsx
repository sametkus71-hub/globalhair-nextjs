import { useLayoutEffect, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { ScrollFadeLogo } from '@/components/ScrollFadeLogo';
import { BeforeAfterGrid } from '@/components/haartransplantatie/BeforeAfterGrid';
import { VideoPlaySection } from '@/components/haartransplantatie/VideoPlaySection';
import { BottomNavigation } from '@/components/haartransplantatie/BottomNavigation';
import { FloatingActionPortal } from '@/components/FloatingActionPortal';
import { InstagramPostsSection } from '@/components/haartransplantatie/InstagramPostsSection';
import { useFullPageScroll } from '@/hooks/useFullPageScroll';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();
  const pageScrollHook = useFullPageScroll();

  // Force scroll to top immediately on mount
  useLayoutEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also reset any scroll containers
    const scrollContainers = document.querySelectorAll('.smooth-scroll-container');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });
  }, []);

  useEffect(() => {
    console.log('🏥 HaartransplantatiePage mounted');
    
    // Initialize scroll system
    pageScrollHook.initializeScroll();
    
    // Expose page scroll hook to global for FloatingActionPortal
    (window as any).pageScrollHook = pageScrollHook;
    
    return () => {
      console.log('🏥 HaartransplantatiePage unmounting');
      delete (window as any).pageScrollHook;
    };
  }, [pageScrollHook]);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <PageTransition isNewPage={true}>
        <div className="fullpage-container">
          {/* Hero Section */}
          <section 
            id="hero-section"
            className="snap-section content-section relative"
            style={{ 
              height: `${height}px`
            }}
          >
            {/* Fading Central Logo */}
            <ScrollFadeLogo />
            
            {/* Top Section - Before/After Grid */}
            <div 
              className="relative z-10"
              style={{ 
                height: `${height * 0.47}px`
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
                height: `${height * 0.53}px`
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

          {/* Instagram-style Posts */}
          <InstagramPostsSection />

          {/* Floating Action Buttons - rendered via portal */}
          <FloatingActionPortal />
        </div>

        {/* Fixed Bottom Navigation - outside scroll container */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNavigation />
        </div>
      </PageTransition>
    </>
  );
};

export default HaartransplantatiePage;