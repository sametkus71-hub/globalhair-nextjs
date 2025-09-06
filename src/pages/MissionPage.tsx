import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { useNavigate } from 'react-router-dom';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';

const MissionPage: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    // Navigate back to home
    const homePath = language === 'nl' ? '/nl' : '/en';
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate(homePath);
    }, 300);
  };

  const handleMethodsClick = () => {
    // Store current path for back navigation
    sessionStorage.setItem('previousPath', window.location.pathname);
    const methodPath = language === 'nl' ? '/nl/info/methode' : '/en/info/method';
    navigate(methodPath);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
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

  return (
    <>
      <MetaHead 
        title={t('mission.page.title')}
        description={t('mission.page.description')}
        language={language}
      />
      <div className={`info-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'slide-exit-right' : 'slide-enter-left'}`}>
        {/* Background matching parent */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#E4E5E0' }}>
          
          {/* Close button */}
          <button
            onClick={handleClose}
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
                  PRECISION IS OUR MISSION.
                </h1>
                <p className="text-base md:text-lg xl:text-xl text-gray-600 font-normal tracking-wide">
                  {language === 'nl' ? '+10.000 behandelingen en we blijven groeien.' : '+10,000 treatments and we keep growing.'}
                </p>
              </div>

              {/* Video Section - Large space like accordion section */}
              <div className={`flex-1 mb-8 md:mb-16 transition-all duration-500 ease-out ${
                contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="w-full flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                  {/* Video Placeholder */}
                  <div className="w-full max-w-md aspect-video bg-white/10 rounded-xl flex items-center justify-center border border-gray-300/20">
                    <div className="w-16 h-16 rounded-full bg-gray-400/40 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Founder Text */}
                <div className="text-left">
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {language === 'nl' 
                      ? 'Founder & Medisch Directeur, Berkant Dural, zag al op jonge leeftijd wat erfelijk haarverlies met zijn vader deed en hij was ervan overtuigd dat dit voorkomen kon worden. Na jaren onderzoek en samenwerkingen met Tricho artsen ontwikkelde hij een werkwijze niet alleen voor zijn eigen haar, maar ook voor meer.'
                      : 'Founder & Medical Director, Berkant Dural, saw at a young age what hereditary hair loss did to his father and he was convinced that this could be prevented. After years of research and collaborations with Tricho doctors, he developed a method not only for his own hair, but also for more.'
                    }
                  </p>
                </div>
              </div>

              {/* Bottom Button */}
              <div className={`text-center mt-auto pt-4 transition-all duration-500 ease-out ${
                buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <button
                  onClick={handleMethodsClick}
                  className="py-2.5 md:py-3 px-6 md:px-8 bg-black text-white text-sm font-normal rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out"
                >
                  {language === 'nl' ? 'bekijk methodes' : 'view methods'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Portal */}
      <BottomNavigationPortal />
    </>
  );
};

export default MissionPage;