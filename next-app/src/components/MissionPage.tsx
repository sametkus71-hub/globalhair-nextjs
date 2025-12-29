'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { MissionCardGlass } from '@/components/mission/MissionCardGlass';
import { getBerkantVideoById, BERKANT_VIDEOS } from '@/data/berkantVideos';
import { ChevronRight } from 'lucide-react';
import { ContentSection } from '@/components/haartransplantatie/ContentSection';
const MissionPage: React.FC = () => {
  const {
    language
  } = useLanguage();
  const {
    t
  } = useTranslation(language);
  const router = useRouter();
  const {
    handlePopupClose
  } = usePopupClose();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(false);

  // Get video from URL parameters
  const videoId = searchParams.get('video');
  const berkantVideo = videoId ? getBerkantVideoById(videoId) : null;

  // Get next video ID for cycling through videos
  const getNextVideoId = () => {
    if (!videoId) return 'berkant-1';
    const currentIndex = BERKANT_VIDEOS.findIndex(video => video.id === videoId);
    const nextIndex = (currentIndex + 1) % BERKANT_VIDEOS.length;
    return BERKANT_VIDEOS[nextIndex].id;
  };

  // Handle next video navigation
  const handleNextVideo = () => {
    const nextVideoId = getNextVideoId();
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('video', nextVideoId);
    router.push(`?${newParams.toString()}`);

    // Reset next button visibility for new video
    setNextButtonVisible(false);
  };
  const handleClose = () => {
    setIsExiting(true);
    // Navigate back to reviews page instead of using popup close
    const reviewsPath = language === 'nl' ? '/nl/reviews' : '/en/reviews';
    setTimeout(() => {
      router.push(reviewsPath);
    }, 350);
  };
  const handleMethodsClick = () => {
    // Store current path for back navigation
    sessionStorage.setItem('previousPath', window.location.pathname);
    const methodPath = language === 'nl' ? '/nl/info/methode' : '/en/info/method';
    router.push(methodPath as any);
  };

  // Handle video loading and staggered entrance animations
  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);
    const timer3 = setTimeout(() => setButtonVisible(true), 500);
    const timer4 = setTimeout(() => setNextButtonVisible(true), 8000); // Show next button after 8 seconds

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
      clearTimeout(timer4);
    };
  }, [berkantVideo]);
  return <>
      <SEOHead 
        title={language === 'nl' ? 'Onze Missie' : 'Our Mission'} 
        description={language === 'nl' ? 'Ontdek de missie van GlobalHair Institute en onze visie op haartransplantatie.' : 'Discover the mission of GlobalHair Institute and our vision on hair transplantation.'} 
      />
      

      
      <div className={`fixed inset-0 w-full h-full overflow-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {berkantVideo ?
      // Berkant Video Background
      <video ref={videoRef} src={berkantVideo.videoUrl} autoPlay loop muted={false} playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" /> :
      // Fallback background
      <div className="absolute inset-0 w-full h-full bg-gray-900"></div>}
        
        {/* Gradient overlay for video quality */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/10 via-black/30 to-black/60"></div>
        
        {/* Close button */}
        <PopupCloseButton onClose={handleClose} />
        
        {/* Content overlay - centered mission card */}
        <div className="relative z-10 w-full h-full flex items-center justify-center px-4 py-8 pb-32">
          <ContentSection className="flex items-center justify-center">
            <div 
              className={`w-full max-w-4xl transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{
                marginTop: 'clamp(2rem, 8vh, 4rem)',
              }}
            >
              <MissionCardGlass />
            </div>
          </ContentSection>
        </div>
      </div>
    </>;
};
export default MissionPage;