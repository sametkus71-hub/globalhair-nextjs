import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { usePageLoader } from '@/hooks/usePageLoader';
import { MetaHead } from '@/components/MetaHead';
import { GenderToggle } from '@/components/homepage/GenderToggle';
import { VideoGrid } from '@/components/homepage/VideoGrid';
import { ColorSelector } from '@/components/homepage/ColorSelector';
import { HairTypeSelector } from '@/components/homepage/HairTypeSelector';
import { CentralLogo } from '@/components/homepage/CentralLogo';
import { AnimatedBackground } from '@/components/homepage/AnimatedBackground';

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
        
        {/* Central Logo - Always positioned, with loading animation during load */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className={isLoading ? 'logo-loading-pulse' : ''}>
            <CentralLogo />
          </div>
        </div>
        
        {/* Top section with gender toggle */}
        <div 
          className={`relative z-10 flex flex-col items-center ${
            heightBreakpoint === 'small' ? 'pt-4 pb-4' :
            heightBreakpoint === 'medium' ? 'pt-6 pb-6' :
            'pt-12 pb-8'
          } ${isLoading ? 'entrance-hidden' : (isFirstLoad ? 'entrance-slide-down' : '')}`}
          style={{ 
            animationDelay: isFirstLoad ? '0.3s' : '0s'  // Increased delay
          }}
        >
          <GenderToggle />
        </div>

        {/* Main content area with video grid */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
          <div className={`w-full relative flex justify-center ${
            heightBreakpoint === 'small' ? 'max-h-[calc(100dvh-180px)]' :
            heightBreakpoint === 'medium' ? 'max-h-[calc(100dvh-200px)]' :
            ''
          } ${isLoading ? 'entrance-hidden-scale' : (isFirstLoad ? 'entrance-scale-fade' : '')}`}
          style={{ 
            animationDelay: isFirstLoad ? '0.7s' : '0s'  // Increased delay for grid
          }}
          >
            <VideoGrid className="mx-auto" heightBreakpoint={heightBreakpoint} />
            {/* No second CentralLogo here - it's always positioned above */}
          </div>
        </div>

        {/* Bottom section with selectors */}
        <div 
          className={`relative z-10 flex flex-col items-center ${
            heightBreakpoint === 'small' ? 'pb-4 pt-3 space-y-2' :
            heightBreakpoint === 'medium' ? 'pb-6 pt-4 space-y-3' :
            'pb-8 sm:pb-12 pt-6 sm:pt-8 space-y-4 sm:space-y-6'
          } ${isLoading ? 'entrance-hidden-up' : (isFirstLoad ? 'entrance-slide-up' : '')}`} 
          style={{ 
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            animationDelay: isFirstLoad ? '0.5s' : '0s'  // Increased delay for bottom 
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