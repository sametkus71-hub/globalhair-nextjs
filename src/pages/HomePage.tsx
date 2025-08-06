import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { usePriorityPageLoader } from '@/hooks/usePriorityPageLoader';
import { usePreventZoom } from '@/hooks/usePreventZoom';
import { PriorityImageLoader, PriorityAsset } from '@/components/PriorityImageLoader';
import { MetaHead } from '@/components/MetaHead';
import { GenderToggle } from '@/components/homepage/GenderToggle';
import { VideoGrid } from '@/components/homepage/VideoGrid';
import { ColorSelector } from '@/components/homepage/ColorSelector';
import { HairTypeSelector } from '@/components/homepage/HairTypeSelector';
import { LogoPriority } from '@/components/homepage/LogoPriority';


import { cn } from '@/lib/utils';
import { usePageTransition } from '@/hooks/usePageTransition';

const HomePage = () => {
  const { language } = useLanguage();
  const { profile } = useSession();
  const { t } = useTranslation(language);
  const { heightBreakpoint } = useViewportHeight();
  const { transitionState, startTransition } = usePageTransition();
  
  // Prevent zoom and unwanted interactions
  usePreventZoom();
  
  // Priority asset loading for smooth experience
  const priorityAssets: PriorityAsset[] = [
    { src: '/assets/logo-shield.png', priority: 'critical' },
    { src: '/assets/hair-blonde.png', priority: 'high' },
    { src: '/assets/hair-brown.png', priority: 'high' },
    { src: '/assets/hair-dark.png', priority: 'high' },
    { src: '/assets/hair-gray.png', priority: 'high' }
  ];
  
  const { 
    isFirstLoad, 
    showLogo, 
    showContent, 
    allLoaded,
    onCriticalLoaded,
    onHighLoaded,
    onAllLoaded
  } = usePriorityPageLoader({
    assets: priorityAssets,
    criticalDelay: 300,
    minLoadingTime: 800
  });

  useEffect(() => {
    // Add fullscreen class to body
    document.body.classList.add('fullscreen-no-scroll');
    
    return () => {
      document.body.classList.remove('fullscreen-no-scroll');
    };
  }, []);


  return (
    <>
      {/* Priority image loading system */}
      <PriorityImageLoader 
        assets={priorityAssets}
        onCriticalLoaded={onCriticalLoaded}
        onHighLoaded={onHighLoaded}
        onAllLoaded={onAllLoaded}
      />
      <MetaHead language={language} page="home" />
      
      {/* Priority Logo - shows first */}
      <LogoPriority 
        isLoading={!showLogo}
        showContent={showContent}
      />
      
      <div className="fullscreen-safe flex flex-col relative overflow-hidden">
        {/* Content with relative positioning over the persistent background */}
        
        {/* Top section with gender toggle - shows after content loads */}
        <div 
          className={cn(
            "relative z-10 flex justify-center flex-shrink-0",
            heightBreakpoint === 'small' ? 'pt-4 pb-2' :
            heightBreakpoint === 'medium' ? 'pt-6 pb-3' :
            'pt-8 pb-6',
            // Animation classes
            !showContent ? 'opacity-0 translate-y-2' : (isFirstLoad ? 'animate-fade-in' : 'opacity-100'),
            // Transition classes
            transitionState.fadeOut && 'page-transition-fade-out'
          )}
          data-debug-fadeout={transitionState.fadeOut ? 'true' : 'false'}
          style={{ 
            paddingTop: heightBreakpoint === 'small' ? 'max(1rem, env(safe-area-inset-top))' : undefined,
            animationDelay: isFirstLoad && showContent ? '0.1s' : '0s',
            transition: 'all 0.5s ease-out'
          }}
        >
          <GenderToggle />
        </div>

        {/* Main content area with video grid - hidden during loading, with footer compensation */}
        <div 
          className="flex-1 flex items-center justify-center px-2 sm:px-4 relative min-h-0"
          style={{ marginBottom: '-50px' }} // Increased footer compensation
        >
          <div 
            className={cn(
              "relative flex items-center justify-center w-full h-full",
              // Animation classes
              !showContent ? 'opacity-0 scale-95' : (isFirstLoad ? 'animate-scale-in' : 'opacity-100'),
              // Transition classes for buttons
              transitionState.fadeOut && 'page-transition-buttons-fade'
            )}
            data-debug-buttons-fadeout={transitionState.fadeOut ? 'true' : 'false'}
            style={{ 
              animationDelay: isFirstLoad && showContent ? '0.3s' : '0s',
              transition: 'all 0.6s ease-out'
            }}
          >
            <VideoGrid 
              className="mx-auto" 
              heightBreakpoint={heightBreakpoint}
              startTransition={startTransition}
            />
          </div>
        </div>

        {/* Bottom section with selectors - shows after content loads */}
        <div 
          className={cn(
            "relative z-10 flex flex-col items-center flex-shrink-0",
            heightBreakpoint === 'small' ? 'pb-4 pt-3 space-y-3' :
            heightBreakpoint === 'medium' ? 'pb-6 pt-4 space-y-4' :
            'pb-6 sm:pb-8 pt-4 sm:pt-6 space-y-5 sm:space-y-6',
            // Animation classes
            !showContent ? 'opacity-0 translate-y-4' : (isFirstLoad ? 'animate-fade-in' : 'opacity-100'),
            // Transition classes
            transitionState.fadeOut && 'page-transition-fade-out'
          )}
          data-debug-bottom-fadeout={transitionState.fadeOut ? 'true' : 'false'}
          style={{ 
            paddingBottom: 'max(3rem, env(safe-area-inset-bottom))', // Increased bottom padding
            paddingTop: heightBreakpoint === 'small' ? 'max(0.75rem, env(safe-area-inset-top))' : undefined,
            animationDelay: isFirstLoad && showContent ? '0.2s' : '0s',
            transition: 'all 0.5s ease-out'
          }}
        >
          {/* Hair Color Selector */}
          <ColorSelector heightBreakpoint={heightBreakpoint} />
          
          {/* Hair Type Selector */}
          <HairTypeSelector heightBreakpoint={heightBreakpoint} />
        </div>
      </div>
    </>
  );
};

export default HomePage;