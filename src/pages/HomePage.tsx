import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { useViewportHeight } from '@/hooks/useViewportHeight';
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
        {/* Animated Background */}
        <AnimatedBackground />
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-900/40" />
        
        {/* Top section with gender toggle */}
        <div className={`relative z-10 flex flex-col items-center ${
          heightBreakpoint === 'small' ? 'pt-4 pb-4' :
          heightBreakpoint === 'medium' ? 'pt-6 pb-6' :
          'pt-12 pb-8'
        }`}>
          <GenderToggle />
        </div>

        {/* Main content area with video grid */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
          <div className={`w-full relative flex justify-center ${
            heightBreakpoint === 'small' ? 'max-h-[calc(100dvh-180px)]' :
            heightBreakpoint === 'medium' ? 'max-h-[calc(100dvh-200px)]' :
            ''
          }`}>
            <VideoGrid className="mx-auto" heightBreakpoint={heightBreakpoint} />
            <CentralLogo />
          </div>
        </div>

        {/* Bottom section with selectors */}
        <div className={`relative z-10 flex flex-col items-center ${
          heightBreakpoint === 'small' ? 'pb-4 pt-3 space-y-2' :
          heightBreakpoint === 'medium' ? 'pb-6 pt-4 space-y-3' :
          'pb-8 sm:pb-12 pt-6 sm:pt-8 space-y-4 sm:space-y-6'
        }`} style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
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