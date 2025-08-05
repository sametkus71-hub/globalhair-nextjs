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
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ 
        background: '#111111',
        height: '100dvh' // Use dynamic viewport height for better mobile support
      }}>
        {/* Animated Background - Always visible */}
        <AnimatedBackground />
        
        {/* Background Overlay - Always visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-900/40" />
        
        {/* Background elements always visible */}
        
        {/* Top section with gender toggle - hidden during loading */}
        <div 
          className={cn(
            "relative z-10 flex flex-col items-center",
            heightBreakpoint === 'small' ? 'pt-4 pb-4' :
            heightBreakpoint === 'medium' ? 'pt-6 pb-6' :
            'pt-12 pb-8',
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
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
          <div 
            className={cn(
              "w-full relative flex justify-center",
              heightBreakpoint === 'small' ? 'max-h-[calc(100dvh-180px)]' :
              heightBreakpoint === 'medium' ? 'max-h-[calc(100dvh-200px)]' :
              '',
              // Animation classes
              isLoading ? 'entrance-hidden-scale' : (isFirstLoad ? 'entrance-scale-fade' : '')
            )}
            style={{ 
              animationDelay: isFirstLoad && !isLoading ? '0.7s' : '0s'
            }}
          >
            <VideoGrid className="mx-auto" heightBreakpoint={heightBreakpoint} />
          </div>
          
          {/* Central Logo - Always visible, positioned in grid center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer">
            <div className={isLoading ? 'logo-loading-pulse' : ''}>
              <CentralLogo />
            </div>
          </div>
        </div>

        {/* Bottom section with selectors - hidden during loading */}
        <div 
          className={cn(
            "relative z-10 flex flex-col items-center",
            heightBreakpoint === 'small' ? 'pb-4 pt-3 space-y-2' :
            heightBreakpoint === 'medium' ? 'pb-6 pt-4 space-y-3' :
            'pb-8 sm:pb-12 pt-6 sm:pt-8 space-y-4 sm:space-y-6',
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