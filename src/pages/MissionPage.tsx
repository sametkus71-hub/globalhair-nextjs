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
        
        {/* Content overlay - will be enhanced later */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className={`text-center transition-all duration-500 ease-out ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-[0.9] tracking-tight drop-shadow-lg">
              PRECISION IS OUR MISSION.
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-normal tracking-wide drop-shadow">
              {language === 'nl' ? '+10.000 behandelingen en we blijven groeien.' : '+10,000 treatments and we keep growing.'}
            </p>
          </div>
        </div>
      </div>
      <BottomNavigationPortal />
    </>
  );
};

export default MissionPage;