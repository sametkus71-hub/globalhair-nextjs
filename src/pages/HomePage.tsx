import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { usePageLoader } from '@/hooks/usePageLoader';
import { usePreventZoom } from '@/hooks/usePreventZoom';
import { useTransition } from '@/contexts/TransitionContext';
import { ImagePreloader } from '@/components/ImagePreloader';
import { MetaHead } from '@/components/MetaHead';
import { GenderToggle } from '@/components/homepage/GenderToggle';
import { VideoGrid } from '@/components/homepage/VideoGrid';
import { ColorSelector } from '@/components/homepage/ColorSelector';
import { HairTypeSelector } from '@/components/homepage/HairTypeSelector';
import { getAllImagePaths } from '@/data/beforeAfterImages';

import { cn } from '@/lib/utils';

const HomePage = () => {
  const { profile, language } = useSession();
  const { t } = useTranslation(language);
  const { heightBreakpoint } = useViewportHeight();
  const { transitionState, startTransition } = useTransition();
  
  // Prevent zoom and unwanted interactions
  usePreventZoom();
  
  // Preload images for smooth experience
  const imagesToPreload = [
    '/lovable-uploads/aca001f8-e280-494a-b8a8-028265622a3c.png', // blonde hair
    '/lovable-uploads/92fc5805-8251-412a-ae5f-da33d30a2dde.png', // brown hair
    '/lovable-uploads/df4923b9-9a1c-4947-af38-2c39249664a4.png', // black hair
    '/lovable-uploads/30181b08-9d4b-4553-98aa-04bd671930be.png', // gray hair
    '/lovable-uploads/1c0a6d55-db05-4d05-a47b-e6dd814c6d62.png', // logo
    ...getAllImagePaths() // Add all before/after images for haartransplantatie page
  ];
  
  
  const { isLoading, isFirstLoad } = usePageLoader({
    preloadDuration: 800, // Reduced since images are cached
    images: imagesToPreload,
    maxWaitMs: 3000,
    persistAcrossSessions: true
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
      {/* Preload critical images immediately */}
      <ImagePreloader images={imagesToPreload} />
      <MetaHead language={language} page="home" />
      <div className="relative overflow-hidden" style={{ height: 'var(--app-height)' }}>
        {/* Full screen video grid */}
        <div 
          className={cn(
            "relative w-full h-full",
            // Animation classes
            isLoading ? 'entrance-hidden-scale' : (isFirstLoad ? 'entrance-scale-fade' : ''),
            // Ultra-fast transition for video grid
            transitionState.fadeOut && 'page-transition-fade-out'
          )}
          style={{ 
            animationDelay: isFirstLoad && !isLoading ? '0.7s' : '0s'
          }}
        >
          <VideoGrid 
            heightBreakpoint={heightBreakpoint}
            startTransition={startTransition}
          />
        </div>

        {/* Top section with gender toggle - floating overlay */}
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 z-20 flex justify-center",
            heightBreakpoint === 'small' ? 'pt-4' :
            heightBreakpoint === 'medium' ? 'pt-6' :
            'pt-8',
            // Animation classes
            isLoading ? 'entrance-hidden' : (isFirstLoad ? 'entrance-slide-down' : ''),
            // Fast transition for interactive elements during logo animation
            transitionState.fadeOut && 'page-transition-elements-fast-fade'
          )}
          style={{ 
            paddingTop: heightBreakpoint === 'small' ? 'max(1rem, env(safe-area-inset-top))' : undefined,
            animationDelay: isFirstLoad && !isLoading ? '0.3s' : '0s'
          }}
        >
          <GenderToggle />
        </div>

        {/* Bottom section with selectors - floating overlay */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center",
            heightBreakpoint === 'small' ? 'pb-4 space-y-3' :
            heightBreakpoint === 'medium' ? 'pb-6 space-y-4' :
            'pb-6 sm:pb-8 space-y-5 sm:space-y-6',
            // Animation classes
            isLoading ? 'entrance-hidden-up' : (isFirstLoad ? 'entrance-slide-up' : ''),
            // Fast transition for interactive elements during logo animation
            transitionState.fadeOut && 'page-transition-elements-fast-fade'
          )}
          style={{ 
            paddingBottom: 'max(3rem, env(safe-area-inset-bottom))',
            animationDelay: isFirstLoad && !isLoading ? '0.5s' : '0s'
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