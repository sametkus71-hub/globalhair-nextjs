import { useLayoutEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { GlassHeader } from '@/components/haartransplantatie/GlassHeader';
import { AnimatedHeadHero } from '@/components/haartransplantatie/AnimatedHeadHero';
import { GlassTabs } from '@/components/haartransplantatie/GlassTabs';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { TabPreloader } from '@/components/haartransplantatie/TabPreloader';

export const HaartransplantatieLayout = () => {
  const { language } = useLanguage();
  const location = useLocation();
  
  // Check if we're on a package route (should render as overlay)
  const isPackageRoute = /\/(nl|en)\/(haartransplantatie|hair-transplant)\/(nl|tr)\/(standard|premium|elite)/.test(location.pathname);
  
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
      <TabPreloader />
      
      <div className="relative w-full min-h-screen">
        <DesktopContainer>
          {/* Glass Header - hide on package popup routes */}
          {!isPackageRoute && (
            <div className="hide-when-popup">
              <GlassHeader />
            </div>
          )}

            {/* Main Content - Single Screen with height-responsive scaling */}
            <div className="relative z-10 flex flex-col h-screen overflow-hidden" style={{ paddingTop: 'clamp(2rem, 8vh, 120px)' }}>
              {/* Content Flow Container */}
              <div className="relative flex flex-col flex-1 overflow-hidden" style={{ paddingTop: 'clamp(1.5rem, 2vh, 2.5rem)' }}>
                {/* Animated Head Hero (Button Only) */}
                <div className="flex-shrink-0 pb-[10px]">
                  <AnimatedHeadHero />
                </div>

                {/* Tabs */}
                <div className="flex-shrink-0" style={{ padding: '1.0rem 0' }}>
                  <GlassTabs activeTab={activeTab} />
                </div>

                {/* Tab Content - Flexible height with footer clearance */}
                <div 
                  className="relative flex-1 overflow-hidden flex flex-col" 
                  style={{ 
                    paddingTop: 'clamp(0rem, 0.3vh, 0.6rem)', 
                    paddingBottom: 'clamp(4rem, 10vh, 6rem)' // Clear the footer buttons
                  }}
                >
                  {/* Content from specific page - smooth fade transition on content only */}
                  {!isPackageRoute && (
                    <div 
                      key={location.pathname}
                      className="relative flex-1 overflow-hidden animate-fade-in"
                      style={{ animationDuration: '150ms' }}
                    >
                      <Outlet />
                    </div>
                  )}
                </div>
              </div>
            </div>

          {/* Footer CTA */}
          <FooterCTAGlass />
        </DesktopContainer>
      </div>
      
      {/* Package popup overlay - renders on top when package route is active */}
      {isPackageRoute && <Outlet />}
    </>
  );
};
