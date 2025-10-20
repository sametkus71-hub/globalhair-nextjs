import { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { GlassBackground } from '@/components/haartransplantatie/GlassBackground';
import { GlassHeader } from '@/components/haartransplantatie/GlassHeader';
import { HeadImage } from '@/components/haartransplantatie/HeadImage';
import { AnimatedHeadHero } from '@/components/haartransplantatie/AnimatedHeadHero';
import { GlassTabs } from '@/components/haartransplantatie/GlassTabs';
import { PackageCardGlass } from '@/components/haartransplantatie/PackageCardGlass';
import { ReviewsSectionGlass } from '@/components/haartransplantatie/ReviewsSectionGlass';
import { StaticReviewGlass } from '@/components/haartransplantatie/StaticReviewGlass';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { PlaceholderContent } from '@/components/haartransplantatie/PlaceholderContent';
import { MissionCardGlass } from '@/components/mission/MissionCardGlass';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Packages');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  const [dotsTop, setDotsTop] = useState(0);
  
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleTabChange = (tab: string, direction?: 'left' | 'right') => {
    if (tab === activeTab || isTransitioning) return;
    
    setPreviousTab(activeTab);
    setTransitionDirection(direction || null);
    setIsTransitioning(true);
    
    // Delay tab change to allow exit animation
    setTimeout(() => {
      setActiveTab(tab);
      window.history.pushState({}, '', getTabPath(tab));
      
      // Reset transition state after enter animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
        setPreviousTab(null);
      }, 300);
    }, 200);
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
      handleTabChange(tabs[currentIndex + 1], 'left');
    }
    
    if (isRightSwipe && currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1], 'right');
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

  // Measure and position dots dynamically
  useEffect(() => {
    const measureDotsPosition = () => {
      requestAnimationFrame(() => {
        if (viewportRef.current && contentRef.current) {
          const viewportRect = viewportRef.current.getBoundingClientRect();
          const contentRect = contentRef.current.getBoundingClientRect();
          const gap = 5;
          const calculatedTop = contentRect.bottom - viewportRect.top + gap;
          setDotsTop(calculatedTop);
        }
      });
    };

    measureDotsPosition();

    // Recalculate after transitions
    if (!isTransitioning) {
      measureDotsPosition();
    }

    // Recalculate on resize
    window.addEventListener('resize', measureDotsPosition);
    return () => window.removeEventListener('resize', measureDotsPosition);
  }, [activeTab, isTransitioning]);

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

  const getTabAnimationClass = (tabName: string) => {
    // If not transitioning, no animation
    if (!isTransitioning) return '';
    
    // Current tab (exiting)
    if (tabName === previousTab) {
      return transitionDirection === 'left' 
        ? 'animate-slide-out-left' 
        : 'animate-slide-out-right';
    }
    
    // New tab (entering)
    if (tabName === activeTab) {
      return transitionDirection === 'left'
        ? 'animate-slide-in-from-right'
        : 'animate-slide-in-from-left';
    }
    
    return '';
  };

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      
      {/* Relative wrapper for absolute positioning context */}
      <div className="relative w-full min-h-screen">
        {/* Absolute Positioned Head Image - Top right of viewport */}
        <HeadImage />
        
        <DesktopContainer>
          <PageTransition isNewPage={true}>
          {/* Glassmorphic Background */}
          <GlassBackground />
          
          {/* Glass Header */}
          <GlassHeader />

          {/* Main Content - Single Screen with height-responsive scaling */}
          <div className="relative z-10 flex flex-col h-screen overflow-hidden pt-[175px]">
            {/* Content Flow Container */}
            <div className="relative flex flex-col flex-1 overflow-hidden" style={{ paddingTop: 'clamp(1.5rem, 2vh, 2.5rem)' }}>
              {/* Animated Head Hero (Button Only) */}
              <div className="flex-shrink-0 pb-[10px]">
                <AnimatedHeadHero />
              </div>

              {/* Tabs */}
              <div className="flex-shrink-0" style={{ paddingTop: 'clamp(0.25rem, 0.5vh, 0.5rem)' }}>
                <GlassTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>

              {/* Tab Content - No scrolling, fit to available height */}
              <div 
                className="relative flex-1 px-2 overflow-hidden flex flex-col justify-between" 
                style={{ paddingTop: 'clamp(0.5rem, 0.8vh, 1rem)', paddingBottom: 'clamp(2rem, 1vh, 1.2rem)' }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
              {/* Animated Tab Content Container */}
              <div ref={viewportRef} className="relative flex-1 overflow-hidden">
                {(activeTab === 'Packages' || (isTransitioning && previousTab === 'Packages')) && (
                  <div 
                    ref={activeTab === 'Packages' ? contentRef : null}
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 px-2 ${getTabAnimationClass('Packages')}`}
                    style={{ 
                      pointerEvents: activeTab === 'Packages' ? 'auto' : 'none'
                    }}
                  >
                    {/* Package Cards */}
                    <PackageCardGlass />
                  </div>
                )}

                {(activeTab === 'Traject' || (isTransitioning && previousTab === 'Traject')) && (
                  <div 
                    ref={activeTab === 'Traject' ? contentRef : null}
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 px-2 ${getTabAnimationClass('Traject')}`}
                    style={{ 
                      pointerEvents: activeTab === 'Traject' ? 'auto' : 'none'
                    }}
                  >
                    <PlaceholderContent type="Traject" />
                  </div>
                )}

                 {(activeTab === 'Mission' || (isTransitioning && previousTab === 'Mission')) && (
                  <div 
                    ref={activeTab === 'Mission' ? contentRef : null}
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 px-2 ${getTabAnimationClass('Mission')}`}
                    style={{ 
                      pointerEvents: activeTab === 'Mission' ? 'auto' : 'none'
                    }}
                  >
                    <MissionCardGlass />
                  </div>
                )}
                
                {/* Pagination Dots - Always visible and not animated */}
                <div 
                  className="absolute left-0 right-0 flex items-center justify-center gap-2 pointer-events-auto z-10" 
                  style={{ 
                    top: dotsTop > 0 ? `${dotsTop}px` : undefined,
                    opacity: dotsTop > 0 ? 1 : 0
                  }}
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        const currentIndex = tabs.indexOf(activeTab);
                        const targetIndex = tabs.indexOf(tab);
                        const direction = targetIndex > currentIndex ? 'left' : 'right';
                        handleTabChange(tab, direction);
                      }}
                      className="transition-all duration-300"
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: activeTab === tab ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  ))}
                </div>


                {(activeTab === 'Contact' || (isTransitioning && previousTab === 'Contact')) && (
                  <div 
                    ref={activeTab === 'Contact' ? contentRef : null}
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 px-2 ${getTabAnimationClass('Contact')}`}
                    style={{ 
                      pointerEvents: activeTab === 'Contact' ? 'auto' : 'none'
                    }}
                  >
                    <PlaceholderContent type="Contact" />
                  </div>
                )}
              </div>

                {/* Static Review Section - Always visible at bottom */}
                <div className="flex-shrink-0 px-2" style={{ paddingBottom: 'clamp(3rem,4vh,4rem)' }}>
                  <StaticReviewGlass />
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA (replaces bottom nav) */}
          <FooterCTAGlass />
        </PageTransition>
      </DesktopContainer>
      </div>
    </>
  );
};

export default HaartransplantatiePage;