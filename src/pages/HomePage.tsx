import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { usePageLoader } from '@/hooks/usePageLoader';
import { useImageCache } from '@/hooks/useImageCache';
import { MetaHead } from '@/components/MetaHead';
import { GenderToggle } from '@/components/homepage/GenderToggle';
import { VideoGrid } from '@/components/homepage/VideoGrid';
import { ColorSelector } from '@/components/homepage/ColorSelector';
import { HairTypeSelector } from '@/components/homepage/HairTypeSelector';
import { CentralLogo } from '@/components/homepage/CentralLogo';
import { AnimatedBackground } from '@/components/homepage/AnimatedBackground';
import { cn } from '@/lib/utils';

const HomePage = () => {
  const { language } = useLanguage();
  const { profile } = useSession();
  const { t } = useTranslation(language);
  const { heightBreakpoint } = useViewportHeight();
  
  // Preload images for smooth experience
  const imagesToPreload = [
    '/assets/hair-blonde.png',
    '/assets/hair-brown.png',
    '/assets/hair-dark.png',
    '/assets/hair-gray.png',
    '/assets/logo-shield.png'
  ];
  
  // Cache images globally to prevent reloading
  useImageCache(imagesToPreload);
  
  const { isLoading, isFirstLoad } = usePageLoader({
    preloadDuration: 1200, // Increased for better loading experience
    images: imagesToPreload
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
      <MetaHead language={language} page="home" />
      <div className="fullscreen-safe flex flex-col relative overflow-hidden" style={{ 
        background: '#111111'
      }}>
        {/* Animated Background - Always visible */}
        <AnimatedBackground />
        
        {/* Background Overlay - Always visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-900/40" />
        
        {/* Top section with gender toggle - hidden during loading */}
        <div 
          className={cn(
            "relative z-10 flex justify-center flex-shrink-0",
            heightBreakpoint === 'small' ? 'pt-2 pb-2' :
            heightBreakpoint === 'medium' ? 'pt-4 pb-3' :
            'pt-8 pb-6',
            // Animation classes
            isLoading ? 'entrance-hidden' : (isFirstLoad ? 'entrance-slide-down' : '')
          )}
          style={{ 
            animationDelay: isFirstLoad && !isLoading ? '0.3s' : '0s'
          }}
        >
          <GenderToggle />
        </div>

        {/* Main content area with video grid - hidden during loading */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 relative min-h-0">
          <div 
            className={cn(
              "relative flex items-center justify-center w-full h-full",
              // Animation classes
              isLoading ? 'entrance-hidden-scale' : (isFirstLoad ? 'entrance-scale-fade' : '')
            )}
            style={{ 
              animationDelay: isFirstLoad && !isLoading ? '0.7s' : '0s'
            }}
          >
            <VideoGrid className="mx-auto" heightBreakpoint={heightBreakpoint} />
            
            {/* Central Logo - Positioned within the grid area, perfectly centered */}
            <div className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer pointer-events-none">
              <div className={cn(
                "pointer-events-auto",
                isLoading ? 'logo-loading-pulse' : ''
              )}>
                <CentralLogo />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with selectors - hidden during loading */}
        <div 
          className={cn(
            "relative z-10 flex flex-col items-center flex-shrink-0",
            heightBreakpoint === 'small' ? 'pb-2 pt-1 space-y-1' :
            heightBreakpoint === 'medium' ? 'pb-4 pt-2 space-y-2' :
            'pb-6 sm:pb-8 pt-4 sm:pt-6 space-y-3 sm:space-y-4',
            // Animation classes
            isLoading ? 'entrance-hidden-up' : (isFirstLoad ? 'entrance-slide-up' : '')
          )}
          style={{ 
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
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