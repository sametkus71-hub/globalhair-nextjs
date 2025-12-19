'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Camera } from 'lucide-react';
import { BERKANT_VIDEOS } from '@/data/berkantVideos';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { SEOHead } from '@/components/SEOHead';

const BerkantDuralPage = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  // const [isDragging, setIsDragging] = useState(false); // Kept dragging state, removing muted
  const [isDragging, setIsDragging] = useState(false);
  // Check if user came from a click (sound=on) or direct access
  const startUnmuted = searchParams.get('sound') === 'on';
  const [isMuted, setIsMuted] = useState(!startUnmuted);

  const videoId = searchParams.get('video');
  const video = BERKANT_VIDEOS.find(v => v.id === videoId) || BERKANT_VIDEOS[0];

  // Get next video ID for cycling through videos
  const getNextVideoId = () => {
    if (!videoId) return 'berkant-1';
    const currentIndex = BERKANT_VIDEOS.findIndex(v => v.id === videoId);
    const nextIndex = (currentIndex + 1) % BERKANT_VIDEOS.length;
    return BERKANT_VIDEOS[nextIndex].id;
  };

  // Handle next video navigation
  const handleNextVideo = () => {
    const nextVideoId = getNextVideoId();
    router.push(`/${language}/berkantdural?video=${nextVideoId}`);
    setNextButtonVisible(false);
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push(`/${language}/haartransplantatie/mission`);
    }, 350);
  };

  const handleMethodsClick = () => {
    sessionStorage.setItem('previousPath', window.location.pathname);
    const homePath = language === 'nl' ? '/nl' : '/en';
    router.push(homePath);
  };

  // Swipe down to close handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientY;
    const diff = currentTouch - touchStart;

    // Only allow downward swipes
    if (diff > 0) {
      setTouchCurrent(currentTouch);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchCurrent) {
      setTouchStart(null);
      setTouchCurrent(null);
      setIsDragging(false);
      return;
    }

    const diff = touchCurrent - touchStart;

    // If swiped down more than 150px, close the modal
    if (diff > 150) {
      handleClose();
    }

    // Reset states
    setTouchStart(null);
    setTouchCurrent(null);
    setIsDragging(false);
  };

  // Handle video loading and staggered entrance animations
  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);
    const timer3 = setTimeout(() => setButtonVisible(true), 500);
    const timer4 = setTimeout(() => setNextButtonVisible(true), 8000);
    const timerEnter = setTimeout(() => setIsEntering(false), 450);

    const videoElement = videoRef.current;

    if (videoElement) {
      // Update video source and reload when video changes
      videoElement.src = video.videoUrl;
      videoElement.load(); // Explicitly start loading
      // autoPlay attribute will handle playback when ready
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Video autoplay failed:", error);
        });
      }
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timerEnter);

      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [video.id, video.videoUrl]);

  return (
    <>
      <SEOHead
        title="Berkant Dural - CEO GlobalHair Institute"
        description="CEO Berkant Dural groeide op in een familie waar kaalheid vanzelfsprekend was, en dat werd zijn drijfveer. GlobalHair ontstond uit die persoonlijke zoektocht: een kliniek gebouwd op aandacht, rust en vakmanschap."
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes border-shine-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-border-shine {
          position: relative;
          overflow: visible;
        }

        .animated-border-shine::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 9999px;
          padding: 2px;
          background: linear-gradient(
            90deg,
            #4B555E 0%,
            #ACB9C1 15.43%,
            #FFFFFF 49.49%,
            #ACB9C1 87.50%,
            #4B555E 100%
          );
          background-size: 200% 100%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: border-shine-rotate 3s linear infinite;
          pointer-events: none;
        }

        .berkant-badge {
          position: relative;
          padding: 0.65rem 1rem;
          border-radius: 9999px;
          background: linear-gradient(90deg, #132536 0%, #25496B 50%, #132536 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .berkant-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          padding: 1.5px;
          background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .berkant-badge-text {
          position: relative;
          z-index: 1;
          font-size: 0.8rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: 0.02em;
        }
      `}} />

      <div
        className="fixed inset-0 w-full h-full overflow-hidden"
        style={{ zIndex: 30 }}
      >
        {/* Fade-in dark overlay - now directly on the global background video */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60 transition-opacity duration-400 ${isEntering ? 'opacity-0' : 'opacity-100'}`}
          style={{ zIndex: 1 }}
        />

        {/* Animated modal wrapper - only this slides up */}
        <div
          className={`absolute inset-0 flex flex-col justify-center px-4 ${isEntering ? 'berkant-modal-enter' : ''} ${isExiting ? 'berkant-modal-exit' : ''}`}
          style={{ zIndex: 3, paddingTop: '50px', paddingBottom: '140px' }}
          onClick={handleClose}
        >
          <section
            className="relative rounded-[24px] p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-2xl mx-auto flex-1 flex flex-col justify-between overflow-hidden touch-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), linear-gradient(180deg, #4B555E 0%, #ACB9C1 15%, #FFFFFF 50%, #ACB9C1 85%, #4B555E 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              transform: isDragging && touchStart && touchCurrent
                ? `translateY(${Math.max(0, touchCurrent - touchStart)}px)`
                : 'translateY(0)',
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          >
            {/* Berkant video as modal background */}
            <video
              key={video.id}
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnail}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
              style={{ zIndex: 0 }}
              onError={(e) => console.error('Video load error:', e)}
              onLoadedMetadata={() => console.log('Video metadata loaded')}
            />

            {/* Dark overlay for better text readability */}
            <div
              className="absolute inset-0 rounded-[24px]"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 37, 64, 0.4) 0%, rgba(17, 53, 86, 0.3) 50%, rgba(24, 24, 27, 0.5) 100%)',
                zIndex: 1
              }}
            />
            {/* Top left - Name badge */}
            <div className={`absolute top-4 left-4 z-20 transition-all duration-500 ease-out ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className="berkant-badge">
                <span className="berkant-badge-text">Berkant Dural</span>
              </div>
            </div>

            {/* Top right - Close button */}
            <button
              onClick={handleClose}
              className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center transition-all duration-500 ease-out hover:opacity-80 rounded-full ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(98, 145, 186, 0.3), rgba(105, 135, 159, 0.3)) padding-box, linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1)) border-box',
                border: '1.5px solid transparent',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: 'inset 0 0 0 1px rgba(240, 240, 240, 0.1)'
              }}
              aria-label={language === 'nl' ? 'Sluiten' : 'Close'}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Mute toggle button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className={`absolute top-4 right-16 z-20 w-10 h-10 flex items-center justify-center transition-all duration-500 ease-out hover:opacity-80 rounded-full ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(98, 145, 186, 0.3), rgba(105, 135, 159, 0.3)) padding-box, linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1)) border-box',
                border: '1.5px solid transparent',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: 'inset 0 0 0 1px rgba(240, 240, 240, 0.1)'
              }}
              aria-label={isMuted ? (language === 'nl' ? 'Geluid aan' : 'Unmute') : (language === 'nl' ? 'Geluid uit' : 'Mute')}
            >
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 9L17 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 9L23 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19.07 4.93C20.9447 6.80527 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39763 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Description and Buttons at bottom */}
            <div className="relative z-10 space-y-6 mt-auto">
              <div className={`max-w-md transition-all duration-500 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <p className="text-xs leading-relaxed font-normal text-left text-white/90 font-inter">
                  CEO Berkant Dural groeide op in een familie waar kaalheid vanzelfsprekend was, en dat werd zijn drijfveer. GlobalHair ontstond uit die persoonlijke zoektocht: een kliniek gebouwd op aandacht, rust en vakmanschap. Met zijn team werkt hij elke dag aan één doel; het herstellen van zelfvertrouwen, met precisie en respect voor het ambacht.
                </p>
              </div>

              {/* Bottom Buttons */}
              <div className={`transition-all duration-500 ease-out ${buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex flex-col items-start gap-4">
                  <button
                    onClick={handleMethodsClick}
                    className="animated-border-shine"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px 28px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '9999px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 400,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: 1 }}>
                      {language === 'nl' ? 'Bekijk methodes' : 'View methods'}
                    </span>
                  </button>

                  {/* Next Video Control */}
                  {nextButtonVisible && (
                    <div
                      onClick={handleNextVideo}
                      className="cursor-pointer flex items-center gap-2 text-white/50 hover:text-white/90 transition-all duration-300 group ml-2"
                      style={{
                        opacity: nextButtonVisible ? 1 : 0,
                        transform: nextButtonVisible ? 'translateY(0)' : 'translateY(10px)'
                      }}
                    >
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                      <span className="text-xs font-light">
                        {language === 'nl' ? 'Volgende video' : 'Next video'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer CTA buttons */}
      <FooterCTAGlass />
    </>
  );
};

export default BerkantDuralPage;
