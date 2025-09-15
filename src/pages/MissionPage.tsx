import React, { useState, useEffect, useRef } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { MissionContent } from '@/components/mission/MissionContent';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { getBerkantVideoById } from '@/data/berkantVideos';

const MissionPage: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const { handlePopupClose } = usePopupClose();
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  
  // Get video from URL parameters
  const videoId = searchParams.get('video');
  const berkantVideo = videoId ? getBerkantVideoById(videoId) : null;

  const handleClose = () => {
    setIsExiting(true);
    // Navigate back to reviews page instead of using popup close
    const reviewsPath = language === 'nl' ? '/nl/reviews' : '/en/reviews';
    setTimeout(() => {
      navigate(reviewsPath);
    }, 350);
  };

  const handleMethodsClick = () => {
    // Store current path for back navigation
    sessionStorage.setItem('previousPath', window.location.pathname);
    const methodPath = language === 'nl' ? '/nl/info/methode' : '/en/info/method';
    navigate(methodPath);
  };

  // Handle video loading and staggered entrance animations
  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);
    const timer3 = setTimeout(() => setButtonVisible(true), 500);
    
    // Auto-play video if available
    if (berkantVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Ignore autoplay failures
      });
    }
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [berkantVideo]);

  return (
    <>
      <MetaHead 
        title={t('mission.page.title')}
        description={t('mission.page.description')}
        language={language}
      />
      <div className={`fixed inset-0 w-full h-full overflow-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {berkantVideo ? (
          // Berkant Video Background
          <video
            ref={videoRef}
            src={berkantVideo.unsubbedUrl}
            autoPlay
            loop
            muted={false}
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          // Fallback background
          <div className="absolute inset-0 w-full h-full bg-gray-900"></div>
        )}
        
        {/* Close button */}
        <PopupCloseButton onClose={handleClose} />
        
        {/* Content overlay */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6 py-20">
          {/* Title */}
          <div className={`text-center mb-8 transition-all duration-500 ease-out ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-0 leading-[0.85] tracking-wider">
              BERKANT
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-wider">
              DURAL
            </h1>
          </div>

          {/* Description Text */}
          <div className={`text-center max-w-lg mx-auto mb-12 transition-all duration-500 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-light">
              {language === 'nl' 
                ? 'Founder & Medisch Directeur, Berkant Dural, zag al op jonge leeftijd wat erfelijk haarverlies met zijn vader deed en hij was ervan overtuigd dat dit voorkomen kon worden. Na jaren onderzoek en samenwerkingen met Tricho artsen ontwikkelde hij een werkwijze niet alleen voor zijn.'
                : 'Founder & Medical Director, Berkant Dural, saw at a young age what hereditary hair loss did to his father and he was convinced that this could be prevented. After years of research and collaborations with Tricho doctors, he developed a method not only for his own hair.'
              }
            </p>
          </div>

          {/* Bottom Button */}
          <div className={`transition-all duration-500 ease-out ${
            buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button
              onClick={handleMethodsClick}
              className="py-3 px-8 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-normal rounded-full hover:bg-white/30 active:scale-[0.98] transition-all duration-300 ease-out"
            >
              {language === 'nl' ? 'Bekijk methodes' : 'View methods'}
            </button>
          </div>
        </div>
      </div>
      <BottomNavigationPortal />
    </>
  );
};

export default MissionPage;