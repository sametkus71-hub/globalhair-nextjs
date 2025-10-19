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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const tabs = ['Packages', 'Traject', 'Mission', 'Contact'];
  const minSwipeDistance = 50;
  
  const getTabPath = (tab: string) => {
    const path = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    const tabPaths: Record<string, string> = {
      'Packages': path,
      'Traject': `${path}/traject`,
      'Mission': `${path}/mission`,
      'Contact': `${path}/contact`,
    };
    return tabPaths[tab] || path;
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.history.pushState({}, '', getTabPath(tab));
  };
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    const currentIndex = tabs.indexOf(activeTab);
    
    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1]);
    }
    
    if (isRightSwipe && currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1]);
    }
  };
  
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
            <div className="flex-shrink-0" style={{ paddingTop: 'clamp(0.25rem, 0.5vh, 0.5rem)' }}>
              <GlassTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Tab Content - No scrolling, fit to available height */}
            <div 
              className="relative flex-1 px-2 pb-[clamp(3rem,4vh,4rem)] overflow-hidden flex flex-col justify-between" 
              style={{ paddingTop: 'clamp(0.5rem, 0.8vh, 1rem)' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {activeTab === 'Packages' && (
                <div className="flex flex-col h-full justify-between">
                  {/* Package Cards */}
                  <div className="overflow-hidden flex-shrink-0">
                    <PackageCardGlass />
                    
                    {/* Pagination Dots */}
                    <div className="flex items-center justify-center gap-2" style={{ marginTop: 'clamp(0.5rem, 1vh, 1rem)' }}>
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => handleTabChange(tab)}
                          className="transition-all duration-300"
                          style={{
                            width: activeTab === tab ? '24px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: activeTab === tab ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Section */}
                  <div className="flex-shrink-0">
                    <StaticReviewGlass />
                  </div>
                </div>
              )}

              {activeTab === 'Traject' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="overflow-hidden flex-shrink-0">
                    <PlaceholderContent type="Traject" />
                    
                    {/* Pagination Dots */}
                    <div className="flex items-center justify-center gap-2" style={{ marginTop: 'clamp(0.5rem, 1vh, 1rem)' }}>
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => handleTabChange(tab)}
                          className="transition-all duration-300"
                          style={{
                            width: activeTab === tab ? '24px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: activeTab === tab ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StaticReviewGlass />
                  </div>
                </div>
              )}

              {activeTab === 'Mission' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="overflow-hidden flex-shrink-0">
                    <PlaceholderContent type="Mission" />
                    
                    {/* Pagination Dots */}
                    <div className="flex items-center justify-center gap-2" style={{ marginTop: 'clamp(0.5rem, 1vh, 1rem)' }}>
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => handleTabChange(tab)}
                          className="transition-all duration-300"
                          style={{
                            width: activeTab === tab ? '24px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: activeTab === tab ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StaticReviewGlass />
                  </div>
                </div>
              )}

              {activeTab === 'Contact' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="overflow-hidden flex-shrink-0">
                    <PlaceholderContent type="Contact" />
                    
                    {/* Pagination Dots */}
                    <div className="flex items-center justify-center gap-2" style={{ marginTop: 'clamp(0.5rem, 1vh, 1rem)' }}>
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => handleTabChange(tab)}
                          className="transition-all duration-300"
                          style={{
                            width: activeTab === tab ? '24px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: activeTab === tab ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StaticReviewGlass />
                  </div>
                </div>
              )}
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