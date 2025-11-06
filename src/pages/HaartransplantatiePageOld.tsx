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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const tabs = ['Treatments', 'Reviews', 'How?', 'Mission', 'Contact'];
  
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
              {/* Animated Tab Content Container */}
              <div ref={viewportRef} className="relative flex-1 overflow-hidden">
                {(activeTab === 'Treatments' || (isTransitioning && previousTab === 'Treatments')) && (
                  <div 
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 ${getTabAnimationClass('Treatments')}`}
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
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 ${getTabAnimationClass('Reviews')}`}
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
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 ${getTabAnimationClass('How?')}`}
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
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 ${getTabAnimationClass('Mission')}`}
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
                    className={`overflow-hidden flex-shrink-0 absolute inset-0 ${getTabAnimationClass('Contact')}`}
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