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
    
    // Measure actual bottom navigation height dynamically
    const measureBottomNavHeight = () => {
      const bottomNav = document.querySelector('[data-bottom-nav]');
      if (bottomNav) {
        const rect = bottomNav.getBoundingClientRect();
        const actualHeight = rect.height;
        document.documentElement.style.setProperty('--bottom-nav-height', `${actualHeight}px`);
        
        // Calculate content heights with the actual navigation height
        const availableHeight = height - actualHeight;
        const sectionHeight = availableHeight / 2;
        
        document.documentElement.style.setProperty('--content-height', `${availableHeight}px`);
        document.documentElement.style.setProperty('--section-height', `${sectionHeight}px`);
        
        console.log(`📱 Bottom nav height: ${actualHeight}px, Available height: ${availableHeight}px`);
      } else {
        // Fallback if nav not found yet
        setTimeout(measureBottomNavHeight, 100);
      }
    };
    
    // Initial measurement after a short delay to ensure DOM is ready
    setTimeout(measureBottomNavHeight, 50);
    
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