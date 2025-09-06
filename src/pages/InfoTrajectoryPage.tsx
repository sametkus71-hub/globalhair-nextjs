import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const InfoTrajectoryPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
    // Always go back to info page
    const infoPath = language === 'nl' ? '/nl/info' : '/en/info';
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate(infoPath);
    }, 300);
  };

  const handleMethodClick = () => {
    // Store current path for back navigation
    sessionStorage.setItem('previousPath', window.location.pathname);
    const methodPath = language === 'nl' ? '/nl/info/methode' : '/en/info/method';
    navigate(methodPath);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Staggered entrance animations
  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);
    const timer3 = setTimeout(() => setButtonVisible(true), 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const trajectData = language === 'nl' ? {
    title: 'MORE THAN A TREATMENT',
    subtitle: '300 gesprekken per maand. 50 worden behandeld',
    nazorgTitle: 'DE BESTE NAZORG',
    nazorgDescription: 'Ons team staat voor u klaar met uitgebreide nazorg en begeleiding tijdens het hele herstelproces.',
    methodButton: 'bekijk methodes'
  } : {
    title: 'MORE THAN A TREATMENT',
    subtitle: '300 conversations per month. 50 get treated',
    nazorgTitle: 'THE BEST AFTERCARE',
    nazorgDescription: 'Our team is ready for you with comprehensive aftercare and guidance throughout the entire recovery process.',
    methodButton: 'view methods'
  };

  return (
    <>
      <MetaHead 
        title={language === 'nl' ? 'Traject' : 'Trajectory'}
        description={language === 'nl' ? 'Informatie over behandeltrajecten' : 'Information about treatment trajectories'}
        language={language}
      />
      <div className={`info-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'slide-exit-right' : 'slide-enter-left'}`}>
        {/* Background matching parent */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#E4E5E0' }}>
          
          {/* Back button */}
          <button
            onClick={handleBack}
            className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-gray-400/60 hover:bg-gray-400/80 transition-colors flex items-center justify-center"
            aria-label={language === 'nl' ? 'Terug' : 'Back'}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          {/* Scrollable Content */}
          <div className="pt-16 md:pt-20 pb-20 md:pb-32 px-6">
            <div className="max-w-2xl mx-auto min-h-[calc(var(--app-height)-8rem)] flex flex-col">
              
              {/* Title Section */}
              <div className={`text-center mb-8 md:mb-16 transition-all duration-500 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-700 mb-3 md:mb-4 leading-[0.9] tracking-tight">
                  {trajectData.title}
                </h1>
                <p className="text-base md:text-lg xl:text-xl text-gray-600 font-normal tracking-wide">
                  {trajectData.subtitle}
                </p>
              </div>

              {/* Central Content Area */}
              <div className={`flex-1 mb-8 md:mb-16 transition-all duration-500 ease-out ${
                contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                
                {/* Central White Circle Placeholder */}
                <div className="flex justify-center mb-12 md:mb-16">
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="text-gray-400 text-sm font-medium">
                      Content Area
                    </div>
                  </div>
                </div>

                {/* Nazorg Section */}
                <div className="text-center mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
                    {trajectData.nazorgTitle}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-lg mx-auto mb-6">
                    {trajectData.nazorgDescription}
                  </p>
                  
                  {/* Navigation Dots */}
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Button */}
              <div className={`text-center mt-auto pt-4 transition-all duration-500 ease-out ${
                buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <button
                  onClick={handleMethodClick}
                  className="py-2.5 md:py-3 px-6 md:px-8 bg-gray-600 text-white text-sm font-normal rounded-full hover:bg-gray-700 active:scale-[0.98] transition-all duration-300 ease-out"
                >
                  {trajectData.methodButton}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoTrajectoryPage;