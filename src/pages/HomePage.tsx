import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { MetaHead } from '@/components/MetaHead';
import { GenderToggle } from '@/components/homepage/GenderToggle';
import { VideoGrid } from '@/components/homepage/VideoGrid';
import { ColorSelector } from '@/components/homepage/ColorSelector';
import { HairTypeSelector } from '@/components/homepage/HairTypeSelector';
import { CentralLogo } from '@/components/homepage/CentralLogo';

const HomePage = () => {
  const { language } = useLanguage();
  const { profile } = useSession();
  const { t } = useTranslation(language);

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
      <div className="min-h-screen bg-gray-900 flex flex-col relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/40 to-gray-900" />
        
        {/* Top section with gender toggle */}
        <div className="relative z-10 flex flex-col items-center pt-12 pb-8">
          <GenderToggle />
        </div>

        {/* Main content area with video grid */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
          <div className="w-full relative flex justify-center">
            <VideoGrid className="mx-auto" />
            <CentralLogo />
          </div>
        </div>

        {/* Bottom section with selectors */}
        <div className="relative z-10 flex flex-col items-center pb-8 sm:pb-12 pt-6 sm:pt-8 space-y-4 sm:space-y-6">
          {/* Hair Color Selector */}
          <ColorSelector />
          
          {/* Hair Type Selector */}
          <HairTypeSelector />
        </div>
      </div>
    </>
  );
};

export default HomePage;