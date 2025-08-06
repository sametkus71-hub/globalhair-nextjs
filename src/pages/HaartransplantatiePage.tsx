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
import { useInstagramScroll } from '@/hooks/useInstagramScroll';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();
  
  // Total sections: 1 hero + 5 Instagram posts
  const totalSections = 6;
  
  const {
    currentSection,
    containerRef,
    scrollToSection,
    scrollToNext,
    isTransitioning,
  } = useInstagramScroll({ 
    totalSections,
    onSectionChange: (section) => {
      console.log('🏥 Section changed to:', section);
    }
  });

  // Force scroll to top immediately on mount
  useLayoutEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    console.log('🏥 HaartransplantatiePage mounted');
    
    // Expose scroll functions to global for FloatingActionPortal
    (window as any).pageScrollHook = {
      scrollToNext,
      currentSection,
      isTransitioning,
    };
    
    return () => {
      console.log('🏥 HaartransplantatiePage unmounting');
      delete (window as any).pageScrollHook;
    };
  }, [scrollToNext, currentSection, isTransitioning]);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <PageTransition isNewPage={true}>
        {/* Instagram-style scroll container */}
        <div 
          ref={containerRef}
          className="instagram-scroll-container"
          style={{
            transform: `translateY(${-currentSection * 100}vh)`,
            transition: isTransitioning ? 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
          }}
        >
          {/* Hero Section */}
          <section 
            id="hero-section"
            className="instagram-section relative"
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
          <InstagramPostsSection 
            currentSection={currentSection} 
            scrollToSection={scrollToSection} 
          />

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