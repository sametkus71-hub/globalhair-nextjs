import { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { GlassHeader } from '@/components/haartransplantatie/GlassHeader';
import { AnimatedHeadHero } from '@/components/haartransplantatie/AnimatedHeadHero';
import { GlassTabs } from '@/components/haartransplantatie/GlassTabs';
import { TreatmentsTabContent } from '@/components/haartransplantatie/TreatmentsTabContent';
import { ReviewsTabContent } from '@/components/haartransplantatie/ReviewsTabContent';
import { HowTabContent } from '@/components/haartransplantatie/HowTabContent';
import { MissionTabContent } from '@/components/haartransplantatie/MissionTabContent';
import { ContactTabContent } from '@/components/haartransplantatie/ContactTabContent';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Treatments');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  const [dotsTop, setDotsTop] = useState(0);
  
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const tabs = ['Treatments', 'Reviews', 'How?', 'Mission', 'Contact'];
  const minSwipeDistance = 50;
  
  const getTabPath = (tab: string) => {
    const path = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    const tabPaths: Record<string, string> = {
      'Treatments': path,
      'Reviews': `${path}/reviews`,
      'How?': `${path}/how`,
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
    if (path.includes('/reviews')) {
      setActiveTab('Reviews');
    } else if (path.includes('/how')) {
      setActiveTab('How?');
    } else if (path.includes('/mission')) {
      setActiveTab('Mission');
    } else if (path.includes('/contact')) {
      setActiveTab('Contact');
    } else {
      setActiveTab('Treatments');
    }
  }, [location.pathname]);

  // Measure and position dots dynamically
  useEffect(() => {
    const measureDotsPosition = () => {
      requestAnimationFrame(() => {
        if (viewportRef.current && contentRef.current) {
          const viewportRect = viewportRef.current.getBoundingClientRect();
          const anchorRect = contentRef.current.getBoundingClientRect();
          const gap = 5;
          // Use anchor's top position relative to viewport
          const calculatedTop = (anchorRect.top - viewportRect.top) + gap;
          // Clamp to viewport bounds
          const maxTop = viewportRef.current.clientHeight - 12;
          const clampedTop = Math.max(0, Math.min(calculatedTop, maxTop));
          setDotsTop(clampedTop);
        }
      });
    };

    measureDotsPosition();

    // Recalculate after transitions
    if (!isTransitioning) {
      setTimeout(measureDotsPosition, 50);
    }

    // Set up ResizeObserver for content changes
    let resizeObserver: ResizeObserver | null = null;
    if (contentRef.current && viewportRef.current) {
      resizeObserver = new ResizeObserver(measureDotsPosition);
      resizeObserver.observe(contentRef.current);
      resizeObserver.observe(viewportRef.current);
    }

    // Recalculate on window resize
    window.addEventListener('resize', measureDotsPosition);
    
    return () => {
      window.removeEventListener('resize', measureDotsPosition);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
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
      
      <div className="relative w-full min-h-screen">
        <DesktopContainer>
          <PageTransition isNewPage={true}>
          {/* Glass Header */}
          <GlassHeader />

          {/* Main Content - Single Screen with height-responsive scaling */}
          <div className="relative z-10 flex flex-col h-screen overflow-hidden" style={{ paddingTop: 'min(20vh, 175px)' }}>
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

              {/* Tab Content - Increased height (removed reviews section) */}
              <div 
                className="relative flex-1 px-2 overflow-hidden flex flex-col" 
                style={{ paddingTop: 'clamp(0.5rem, 0.8vh, 1rem)', paddingBottom: 'clamp(3rem,4vh,4rem)' }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
              {/* Animated Tab Content Container */}
              <div ref={viewportRef} className="relative flex-1 overflow-hidden">
                {(activeTab === 'Treatments' || (isTransitioning && previousTab === 'Treatments')) && (
                  <div 
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 px-2 ${getTabAnimationClass('Treatments')}`}
                    style={{ 
                      pointerEvents: activeTab === 'Treatments' ? 'auto' : 'none'
                    }}
                  >
                    <TreatmentsTabContent />
                    <div 
                      ref={activeTab === 'Treatments' ? contentRef : null} 
                      data-dots-anchor 
                      style={{ height: 1 }} 
                    />
                  </div>
                )}

                {(activeTab === 'Reviews' || (isTransitioning && previousTab === 'Reviews')) && (
                  <div 
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 px-2 ${getTabAnimationClass('Reviews')}`}
                    style={{ 
                      pointerEvents: activeTab === 'Reviews' ? 'auto' : 'none'
                    }}
                  >
                    <ReviewsTabContent />
                    <div 
                      ref={activeTab === 'Reviews' ? contentRef : null} 
                      data-dots-anchor 
                      style={{ height: 1 }} 
                    />
                  </div>
                )}

                {(activeTab === 'How?' || (isTransitioning && previousTab === 'How?')) && (
                  <div 
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 px-2 ${getTabAnimationClass('How?')}`}
                    style={{ 
                      pointerEvents: activeTab === 'How?' ? 'auto' : 'none'
                    }}
                  >
                    <HowTabContent />
                    <div 
                      ref={activeTab === 'How?' ? contentRef : null} 
                      data-dots-anchor 
                      style={{ height: 1 }} 
                    />
                  </div>
                )}

                 {(activeTab === 'Mission' || (isTransitioning && previousTab === 'Mission')) && (
                  <div 
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 px-2 ${getTabAnimationClass('Mission')}`}
                    style={{ 
                      pointerEvents: activeTab === 'Mission' ? 'auto' : 'none'
                    }}
                  >
                    <MissionTabContent />
                    <div 
                      ref={activeTab === 'Mission' ? contentRef : null} 
                      data-dots-anchor 
                      style={{ height: 1 }} 
                    />
                  </div>
                )}

                {(activeTab === 'Contact' || (isTransitioning && previousTab === 'Contact')) && (
                  <div 
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 px-2 ${getTabAnimationClass('Contact')}`}
                    style={{ 
                      pointerEvents: activeTab === 'Contact' ? 'auto' : 'none'
                    }}
                  >
                    <ContactTabContent />
                    <div 
                      ref={activeTab === 'Contact' ? contentRef : null} 
                      data-dots-anchor 
                      style={{ height: 1 }} 
                    />
                  </div>
                )}
              </div>

              {/* Pagination Dots */}
              <div className="flex-shrink-0 px-2 py-2">
                <div className="flex items-center justify-center gap-[0.2rem] pointer-events-auto z-30">
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

export default HaartransplantatiePage;