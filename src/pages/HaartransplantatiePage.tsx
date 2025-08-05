import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { BeforeAfterGrid } from '@/components/haartransplantatie/BeforeAfterGrid';
import { VideoPlaySection } from '@/components/haartransplantatie/VideoPlaySection';
import { BottomNavigation } from '@/components/haartransplantatie/BottomNavigation';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();

  useEffect(() => {
    console.log('🏥 HaartransplantatiePage mounted');
    
    // Add fullscreen class to body for consistency with homepage
    document.body.classList.add('fullscreen-no-scroll');
    
    // Simple fixed height calculation for mobile reliability
    const bottomNavHeight = 80; // Increased for mobile safety
    const availableHeight = height - bottomNavHeight;
    const sectionHeight = availableHeight / 2;
    
    document.documentElement.style.setProperty('--content-height', `${availableHeight}px`);
    document.documentElement.style.setProperty('--section-height', `${sectionHeight}px`);
    document.documentElement.style.setProperty('--bottom-nav-height', `${bottomNavHeight}px`);
    
    return () => {
      console.log('🏥 HaartransplantatiePage unmounting');
      document.body.classList.remove('fullscreen-no-scroll');
    };
  }, [height]);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <PageTransition isNewPage={true}>
        <div 
          className="fullscreen-safe flex flex-col relative overflow-hidden"
        >
          {/* Content with relative positioning over the persistent background */}
          
          {/* Top Section - Before/After Grid with strict height control */}
          <div 
            className="relative z-10 overflow-hidden flex-1"
            style={{ 
              minHeight: 'var(--section-height)',
              maxHeight: 'var(--section-height)'
            }}
          >
            <div 
              className="page-entry-grid page-entry-delay-1 w-full h-full"
              data-page-entry="grid"
            >
              <BeforeAfterGrid />
            </div>
          </div>

          {/* Bottom Section - Video Play & Controls with strict height control */}
          <div 
            className="relative z-10 overflow-hidden flex-1"
            style={{ 
              minHeight: 'var(--section-height)',
              maxHeight: 'var(--section-height)'
            }}
          >
            <div 
              className="page-entry-item page-entry-delay-2 w-full h-full"
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