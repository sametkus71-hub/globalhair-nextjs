import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { MetaHead } from '@/components/MetaHead';
import { LoadingPreloader } from '@/components/homepage/LoadingPreloader';
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
  
  // Loading states for staged animation
  const [showContent, setShowContent] = useState(false);
  const [showTopSection, setShowTopSection] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showBottomSection, setShowBottomSection] = useState(false);
  
  // Preload all images used on the homepage
  const imagesToPreload = [
    '/assets/hair-blonde.png',
    '/assets/hair-brown.png',
    '/assets/hair-dark.png',
    '/assets/hair-gray.png',
    '/assets/logo-shield.png'
  ];
  
  const { allImagesLoaded, loadingProgress } = useImagePreloader({
    images: imagesToPreload
  });

  useEffect(() => {
    // Add fullscreen class to body
    document.body.classList.add('fullscreen-no-scroll');
    
    return () => {
      document.body.classList.remove('fullscreen-no-scroll');
    };
  }, []);

  // Handle staged loading sequence
  const handlePreloaderComplete = () => {
    setShowContent(true);
    
    // Staged animation sequence
    setTimeout(() => setShowTopSection(true), 100);
    setTimeout(() => setShowGrid(true), 300);
    setTimeout(() => setShowBottomSection(true), 500);
  };


  return (
    <>
      <MetaHead language={language} page="home" />
      
      {/* Loading Preloader */}
      <LoadingPreloader 
        isLoading={!allImagesLoaded}
        progress={loadingProgress}
        onComplete={handlePreloaderComplete}
      />
      
      {showContent && (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ 
        background: '#111111',
        height: '100dvh' // Use dynamic viewport height for better mobile support
      }}>
        {/* Animated Background */}
        <AnimatedBackground />
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-900/40" />
        
        {/* Top section with gender toggle */}
        <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ease-out ${
          heightBreakpoint === 'small' ? 'pt-4 pb-4' :
          heightBreakpoint === 'medium' ? 'pt-6 pb-6' :
          'pt-12 pb-8'
        } ${
          showTopSection 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-8'
        }`}>
          <GenderToggle />
        </div>

        {/* Main content area with video grid */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
          <div className={`w-full relative flex justify-center transition-all duration-800 ease-out delay-200 ${
            heightBreakpoint === 'small' ? 'max-h-[calc(100dvh-180px)]' :
            heightBreakpoint === 'medium' ? 'max-h-[calc(100dvh-200px)]' :
            ''
          } ${
            showGrid 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}>
            <VideoGrid className="mx-auto" heightBreakpoint={heightBreakpoint} />
            <CentralLogo />
          </div>
        </div>

        {/* Bottom section with selectors */}
        <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ease-out delay-300 ${
          heightBreakpoint === 'small' ? 'pb-4 pt-3 space-y-2' :
          heightBreakpoint === 'medium' ? 'pb-6 pt-4 space-y-3' :
          'pb-8 sm:pb-12 pt-6 sm:pt-8 space-y-4 sm:space-y-6'
        } ${
          showBottomSection 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`} style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {/* Hair Color Selector */}
          <ColorSelector heightBreakpoint={heightBreakpoint} />
          
          {/* Hair Type Selector */}
          <HairTypeSelector heightBreakpoint={heightBreakpoint} />
        </div>
      </div>
      )}
    </>
  );
};

export default HomePage;