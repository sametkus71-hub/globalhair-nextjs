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
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        
        {/* Top section with logo and gender toggle */}
        <div className="relative z-10 flex flex-col items-center pt-12 pb-8 space-y-8">
          {/* Logo */}
          <div className="font-header text-4xl font-bold text-white">
            GlobalHair
          </div>
          
          {/* Gender Toggle */}
          <GenderToggle />
        </div>

        {/* Main content area with video grid */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-2xl relative">
            <VideoGrid />
            <CentralLogo />
          </div>
        </div>

        {/* Bottom section with selectors */}
        <div className="relative z-10 flex flex-col items-center pb-12 pt-8 space-y-8">
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