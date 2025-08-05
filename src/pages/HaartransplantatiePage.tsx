import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { BeforeAfterGrid } from '@/components/haartransplantatie/BeforeAfterGrid';
import { VideoPlaySection } from '@/components/haartransplantatie/VideoPlaySection';
import { BottomNavigation } from '@/components/haartransplantatie/BottomNavigation';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();

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
        <div className="fullscreen-safe flex flex-col relative overflow-hidden">
          {/* Content with relative positioning over the persistent background */}
          
          {/* Top Section - Before/After Grid with footer compensation */}
          <div className="h-[50vh] relative z-10" style={{ marginBottom: '-30px' }}>
            <div 
              className="page-entry-grid page-entry-delay-1 w-full h-full"
              data-page-entry="grid"
            >
              <BeforeAfterGrid />
            </div>
          </div>

          {/* Bottom Section - Video Play & Controls with footer compensation */}
          <div className="h-[50vh] relative z-10" style={{ marginBottom: '-30px' }}>
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