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
    
    // Set CSS custom properties for dynamic height calculations
    const bottomNavHeight = 60;
    const availableHeight = height - bottomNavHeight;
    const sectionHeight = availableHeight / 2;
    
    document.documentElement.style.setProperty('--content-height', `${availableHeight}px`);
    document.documentElement.style.setProperty('--section-height', `${sectionHeight}px`);
    
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
          style={{ paddingBottom: '60px' }} // Footer compensation for overall layout
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