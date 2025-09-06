import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
      <div className={`reviews-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Background matching design */}
        <div className="min-h-[var(--app-height)] px-6 py-8" style={{ background: '#E4E5E0' }}>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-gray-400/80 hover:bg-gray-500/80 transition-colors flex items-center justify-center"
            aria-label={language === 'nl' ? 'Sluiten' : 'Close'}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          {/* Main Content Container */}
          <div className="max-w-2xl mx-auto pt-16 pb-8 min-h-[calc(var(--app-height)-4rem)] flex flex-col">
            
            {/* Title Section */}
            <div className={`text-center mb-16 transition-all duration-500 ease-out ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-6 leading-[0.85] tracking-tight">
                {t('mission.main.title')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-normal">
                {t('mission.main.subtitle')}
              </p>
            </div>

            {/* Video Section - Large centered space */}
            <div className={`flex-1 flex items-center justify-center mb-16 transition-all duration-500 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="w-full max-w-md aspect-video bg-white/20 rounded-xl flex items-center justify-center border border-gray-300/30">
                {/* Video Placeholder */}
                <div className="w-20 h-20 rounded-full bg-gray-500/30 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className={`mb-12 transition-all duration-500 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed text-left max-w-xl">
                {t('mission.content.founder')}
              </p>
            </div>

            {/* Bottom Button */}
            <div className={`text-center transition-all duration-500 ease-out ${
              buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <button
                onClick={handleMethodsClick}
                className="py-4 px-12 bg-black text-white text-base font-medium rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out"
              >
                {t('mission.button.methods')}
              </button>
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