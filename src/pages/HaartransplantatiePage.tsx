import { useLayoutEffect, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { GlassBackground } from '@/components/haartransplantatie/GlassBackground';
import { GlassHeader } from '@/components/haartransplantatie/GlassHeader';
import { AnimatedHeadHero } from '@/components/haartransplantatie/AnimatedHeadHero';
import { GlassTabs } from '@/components/haartransplantatie/GlassTabs';
import { PackageCardGlass } from '@/components/haartransplantatie/PackageCardGlass';
import { ReviewsSectionGlass } from '@/components/haartransplantatie/ReviewsSectionGlass';
import { StaticReviewGlass } from '@/components/haartransplantatie/StaticReviewGlass';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { PlaceholderContent } from '@/components/haartransplantatie/PlaceholderContent';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Packages');
  
  // Determine active tab from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/traject')) {
      setActiveTab('Traject');
    } else if (path.includes('/mission')) {
      setActiveTab('Mission');
    } else if (path.includes('/contact')) {
      setActiveTab('Contact');
    } else {
      setActiveTab('Packages');
    }
  }, [location.pathname]);

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
      <DesktopContainer>
        <PageTransition isNewPage={true}>
          {/* Glassmorphic Background */}
          <GlassBackground />
          
          {/* Glass Header */}
          <GlassHeader />

          {/* Main Content - Single Screen with height-responsive scaling */}
          <div className="relative z-10 flex flex-col h-screen overflow-hidden pt-[clamp(2rem,2vh,3rem)]">
            {/* Animated Head Hero */}
            <div className="flex-shrink-0">
              <AnimatedHeadHero />
            </div>

            {/* Tabs */}
            <div className="pt-[clamp(0.5rem,1vh,1rem)] flex-shrink-0">
              <GlassTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Tab Content - No scrolling, fit to available height */}
            <div className="relative flex-1 px-2 pb-[clamp(3rem,4vh,4rem)] overflow-hidden flex flex-col justify-between">
              {activeTab === 'Packages' && (
                <div className="flex flex-col h-full justify-evenly">
                  {/* Package Cards */}
                  <div className="overflow-hidden flex-shrink-0">
                    <PackageCardGlass />
                  </div>

                  {/* Review Section */}
                  <div className="flex-shrink-0">
                    <StaticReviewGlass />
                  </div>
                </div>
              )}

              {activeTab === 'Traject' && <PlaceholderContent type="Traject" />}
              {activeTab === 'Mission' && <PlaceholderContent type="Mission" />}
              {activeTab === 'Contact' && <PlaceholderContent type="Contact" />}
            </div>
          </div>

          {/* Footer CTA (replaces bottom nav) */}
          <FooterCTAGlass />
        </PageTransition>
      </DesktopContainer>
    </>
  );
};

export default HaartransplantatiePage;