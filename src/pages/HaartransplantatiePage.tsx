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


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();

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
    return () => {
      console.log('🏥 HaartransplantatiePage unmounting');
    };
  }, []);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <PageTransition isNewPage={true}>
        {/* Hero Section */}
        <section 
          id="hero-section"
          className="content-section relative"
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

        {/* Instagram-style Content Posts - Document Flow */}
        <InstagramPostsSection />

        {/* Floating Action Buttons - rendered via portal */}
        <FloatingActionPortal />

        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNavigation />
        </div>
      </PageTransition>
    </>
  );
};

export default HaartransplantatiePage;