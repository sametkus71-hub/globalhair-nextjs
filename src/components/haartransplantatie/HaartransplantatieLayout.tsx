import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { GlassHeader } from '@/components/haartransplantatie/GlassHeader';
import { AnimatedHeadHero } from '@/components/haartransplantatie/AnimatedHeadHero';
import { GlassTabs } from '@/components/haartransplantatie/GlassTabs';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';

interface HaartransplantatieLayoutProps {
  children: React.ReactNode;
}

export const HaartransplantatieLayout = ({ children }: HaartransplantatieLayoutProps) => {
  const { language } = useLanguage();
  const location = useLocation();
  
  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/reviews')) return 'Reviews';
    if (path.includes('/how')) return 'How?';
    if (path.includes('/mission')) return 'Mission';
    if (path.includes('/contact')) return 'Contact';
    return 'Treatments';
  };

  const activeTab = getActiveTab();

  // Enable scrolling on mount
  useLayoutEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Enable page scrolling
    document.body.style.overflow = '';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      
      <div className="relative w-full min-h-screen">
        <DesktopContainer>
          <PageTransition isNewPage={true}>
            {/* Glass Header */}
            <GlassHeader />

            {/* Main Content - Single Screen with height-responsive scaling */}
            <div className="relative z-10 flex flex-col h-screen overflow-hidden" style={{ paddingTop: 'clamp(6rem, 15vh, 175px)' }}>
              {/* Content Flow Container */}
              <div className="relative flex flex-col flex-1 overflow-hidden" style={{ paddingTop: 'clamp(1.5rem, 2vh, 2.5rem)' }}>
                {/* Animated Head Hero (Button Only) */}
                <div className="flex-shrink-0 pb-[10px]">
                  <AnimatedHeadHero />
                </div>

                {/* Tabs */}
                <div className="flex-shrink-0" style={{ padding: '1.8rem 0' }}>
                  <GlassTabs activeTab={activeTab} />
                </div>

                {/* Tab Content - Flexible height with footer clearance */}
                <div 
                  className="relative flex-1 overflow-hidden flex flex-col" 
                  style={{ 
                    paddingTop: 'clamp(0.5rem, 0.8vh, 1rem)', 
                    paddingBottom: 'clamp(5rem, 12vh, 8rem)' // Clear the footer buttons
                  }}
                >
                  {/* Content from specific page */}
                  <div className="relative flex-1 overflow-hidden">
                    {children}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <FooterCTAGlass />
          </PageTransition>
        </DesktopContainer>
      </div>
    </>
  );
};
