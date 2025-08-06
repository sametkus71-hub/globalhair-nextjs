import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { CentralLogo } from '@/components/homepage/CentralLogo';
import { BeforeAfterGrid } from '@/components/haartransplantatie/BeforeAfterGrid';
import { VideoPlaySection } from '@/components/haartransplantatie/VideoPlaySection';
import { BottomNavigation } from '@/components/haartransplantatie/BottomNavigation';
import { FloatingActionPortal } from '@/components/FloatingActionPortal';
import { TreatmentInfoSection } from '@/components/haartransplantatie/TreatmentInfoSection';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();

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
        <div className="scroll-snap-container">
          {/* First Section - Snap Point */}
          <section 
            id="main-section"
            className="snap-section relative"
            style={{ 
              height: `${height}px`
            }}
          >
            {/* Central Logo positioned within first section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
              <div className="pointer-events-auto">
                <CentralLogo />
              </div>
            </div>
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

          {/* Second Section - Treatment Info with Regular Scroll */}
          <section id="treatment-section" className="snap-section">
            <TreatmentInfoSection />
          </section>

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