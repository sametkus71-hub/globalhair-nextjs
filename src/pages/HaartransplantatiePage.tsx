import { useLayoutEffect, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useInstagramScroll } from '../hooks/useInstagramScroll';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { ScrollFadeLogo } from '@/components/ScrollFadeLogo';
import { BeforeAfterGrid } from '@/components/haartransplantatie/BeforeAfterGrid';
import { VideoPlaySection } from '@/components/haartransplantatie/VideoPlaySection';
import { BottomNavigation } from '@/components/haartransplantatie/BottomNavigation';
import { FloatingActionPortal } from '@/components/FloatingActionPortal';
import { InstagramPostsSection } from '@/components/haartransplantatie/InstagramPostsSection';
import { ScrollProvider, useScrollContext } from '@/contexts/ScrollContext';
import { ScrollIndicator } from '@/components/ScrollIndicator';


const HaartransplantatiePageContent = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();
  const { setCurrentPostIndex, setTotalPosts } = useScrollContext();
  
  const totalSections = 6; // 1 hero + 5 Instagram posts
  
  const { currentSection, scrollToSection } = useInstagramScroll({
    totalSections,
    onSectionChange: (section) => {
      setCurrentPostIndex(section);
    }
  });
  
  // Force scroll to top immediately on mount
  useLayoutEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Setup scroll context
  useEffect(() => {
    console.log('🏥 HaartransplantatiePage mounting');
    setTotalPosts(totalSections);
    
    return () => {
      console.log('🏥 HaartransplantatiePage unmounting');
    };
  }, [setTotalPosts]);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <PageTransition isNewPage={true}>
        {/* Hero Section */}
        <section 
          id="section-0"
          className="snap-section min-h-screen w-full relative"
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

        {/* Scroll Indicator */}
        <ScrollIndicator />

        {/* Floating Action Buttons - rendered via portal */}
        <FloatingActionPortal />

        {/* Fixed Bottom Navigation - outside scroll container */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNavigation />
        </div>
      </PageTransition>
    </>
  );
};

const HaartransplantatiePage = () => {
  return (
    <ScrollProvider>
      <HaartransplantatiePageContent />
    </ScrollProvider>
  );
};

export default HaartransplantatiePage;