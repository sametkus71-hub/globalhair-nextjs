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
    
    return () => {
      console.log('🏥 HaartransplantatiePage unmounting');
      document.body.classList.remove('fullscreen-no-scroll');
    };
  }, []);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <PageTransition isNewPage={true}>
        <div 
          className="flex flex-col relative"
          style={{ 
            height: `${height}px`,
            overflow: 'hidden'
          }}
        >
          {/* Content with relative positioning over the persistent background */}
          
          {/* Top Section - Before/After Grid with strict height control */}
          <div 
            className="relative z-10 overflow-hidden"
            style={{ 
              height: `${height * 0.5}px`
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
            className="relative z-10 overflow-hidden"
            style={{ 
              height: `${height * 0.5 - 55}px` // Subtract footer height (55px)
            }}
          >
            <div 
              className="page-entry-item page-entry-delay-2 w-full h-full"
              data-page-entry="video"
            >
              <VideoPlaySection />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="relative z-40 h-[55px]">
            <BottomNavigation />
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default HaartransplantatiePage;