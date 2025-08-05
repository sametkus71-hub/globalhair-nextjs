import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { BeforeAfterGrid } from '@/components/haartransplantatie/BeforeAfterGrid';
import { VideoPlaySection } from '@/components/haartransplantatie/VideoPlaySection';
import { BottomNavigation } from '@/components/haartransplantatie/BottomNavigation';
import { AnimatedBackground } from '@/components/homepage/AnimatedBackground';

const HaartransplantatiePage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Add fullscreen class to body for consistency with homepage
    document.body.classList.add('fullscreen-no-scroll');
    
    return () => {
      document.body.classList.remove('fullscreen-no-scroll');
    };
  }, []);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <PageTransition isNewPage={true}>
        <div className="fullscreen-safe flex flex-col relative overflow-hidden" style={{ 
          background: '#111111'
        }}>
          {/* Animated Background - Same as homepage */}
          <AnimatedBackground />
          
          {/* Background Overlay - Same as homepage */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-900/40" />
          
          {/* Top Section - Before/After Grid (exactly half the viewport, no padding) */}
          <div className="h-[50vh] relative z-10">
            <div 
              className="page-entry-item page-entry-delay-1 w-full h-full"
              data-page-entry="grid"
            >
              <BeforeAfterGrid />
            </div>
          </div>

          {/* Bottom Section - Video Play & Controls (exactly half the viewport) */}
          <div className="h-[50vh] relative z-10 flex items-center justify-center">
            <div 
              className="page-entry-item page-entry-delay-2"
              data-page-entry="video"
            >
              <VideoPlaySection />
            </div>
          </div>

          {/* Fixed Bottom Navigation */}
          <BottomNavigation />
        </div>
      </PageTransition>
    </>
  );
};

export default HaartransplantatiePage;