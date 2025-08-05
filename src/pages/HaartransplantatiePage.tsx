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
  const { height, heightBreakpoint } = useViewportHeight();

  useEffect(() => {
    console.log('🏥 HaartransplantatiePage mounted');
    
    // Add fullscreen class to body for consistency with homepage
    document.body.classList.add('fullscreen-no-scroll');
    
    // Set CSS custom properties for layout calculations
    const bottomNavHeight = 60; // Base navigation height
    const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0');
    const totalBottomHeight = bottomNavHeight + safeAreaBottom;
    
    document.documentElement.style.setProperty('--bottom-nav-height', `${totalBottomHeight}px`);
    document.documentElement.style.setProperty('--content-height', `${height - totalBottomHeight}px`);
    
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
          style={{ 
            height: 'var(--app-height, 100vh)',
            paddingBottom: `calc(var(--bottom-nav-height, 60px) + ${heightBreakpoint === 'small' ? '8px' : '0px'})`
          }}
        >
          {/* Content with relative positioning over the persistent background */}
          
          {/* Top Section - Before/After Grid with dynamic height control */}
          <div 
            className="relative z-10 overflow-hidden flex-1"
            style={{ 
              height: `calc(var(--content-height, calc(100vh - 60px)) / 2)`,
              minHeight: heightBreakpoint === 'small' ? '200px' : '250px'
            }}
          >
            <div 
              className="page-entry-grid page-entry-delay-1 w-full h-full"
              data-page-entry="grid"
            >
              <BeforeAfterGrid />
            </div>
          </div>

          {/* Bottom Section - Video Play & Controls with dynamic height control */}
          <div 
            className="relative z-10 overflow-hidden flex-1"
            style={{ 
              height: `calc(var(--content-height, calc(100vh - 60px)) / 2)`,
              minHeight: heightBreakpoint === 'small' ? '200px' : '250px'
            }}
          >
            <div 
              className="page-entry-item page-entry-delay-2 w-full h-full"
              data-page-entry="video"
            >
              <VideoPlaySection heightBreakpoint={heightBreakpoint} />
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