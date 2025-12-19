'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { OZLEM_VIDEO } from '@/data/ozlemVideos';
import { useLanguage } from '@/hooks/useLanguage';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { SEOHead } from '@/components/SEOHead';

const OzlemDuralPage = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(!searchParams.get('sound'));

  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle user activity for dimming text
  const handleUserActivity = () => {
    setIsUserActive(true);
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    activityTimerRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 3000);
  };

  useEffect(() => {
    // Initial timer
    handleUserActivity();

    // Activity listeners
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    };
  }, []);

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

    if (diff > 150) {
      handleClose();
    }

    setTouchStart(null);
    setTouchCurrent(null);
    setIsDragging(false);
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);
    const timer3 = setTimeout(() => setButtonVisible(true), 500);
    const timerEnter = setTimeout(() => setIsEntering(false), 450);

    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.src = OZLEM_VIDEO.videoUrl;
      videoElement.load();
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerEnter);

      if (videoElement) {
        videoElement.pause();
      }
    };
  }, []);

  return (
    <>
      <SEOHead
        title="Özlem Dural - CPO GlobalHair Institute"
        description="Als CPO van GlobalHair Institute zorgt Özlem Dural ervoor dat elke cliënt een naadloze en persoonlijke ervaring krijgt."
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
        .animated-border-shine > * {
          position: relative;
          z-index: 1;
        }

        .ozlem-badge {
          position: relative;
          padding: 0.65rem 1rem;
          border-radius: 9999px;
          background: linear-gradient(90deg, #132536 0%, #25496B 50%, #132536 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ozlem-badge::before {
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

        .ozlem-badge-text {
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
        {/* Fade-in dark overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60 transition-opacity duration-400 ${isEntering ? 'opacity-0' : 'opacity-100'}`}
          style={{ zIndex: 1 }}
        />

        {/* Animated modal wrapper */}
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
            {/* Video as modal background */}
            <video
              ref={videoRef}
              src={OZLEM_VIDEO.videoUrl}
              poster={OZLEM_VIDEO.thumbnail}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
              style={{ zIndex: 0 }}
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

            {/* Mute toggle button - Aligned with Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className={`absolute top-16 right-4 z-20 w-10 h-10 flex items-center justify-center transition-all duration-500 ease-out hover:opacity-80 rounded-full ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
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

            {/* Bottom Content Area - Instagram/TikTok Style */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end transition-opacity duration-1000 ease-out ${isUserActive ? 'opacity-100' : 'opacity-20 hover:opacity-100'}`}
              onMouseEnter={handleUserActivity}
              onTouchStart={handleUserActivity}
            >
              {/* Identity Row */}
              <div className={`transition-all duration-500 ease-out mb-3 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-2">
                  <h2 className="text-white font-bold text-lg drop-shadow-md">Özlem Dural</h2>
                  <span className="text-white/80 text-sm bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                    CPO
                  </span>
                </div>
              </div>

              {/* Description Row */}
              <div className={`transition-all duration-500 delay-100 ease-out mb-4 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div
                  className="text-sm font-normal text-white/95 font-inter drop-shadow-md cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  <p className={isExpanded ? "" : "line-clamp-1"}>
                    {OZLEM_VIDEO.description}
                  </p>
                  {!isExpanded && (
                    <span className="text-white/60 text-xs font-semibold ml-1 hover:text-white transition-colors">
                      {language === 'nl' ? '...meer' : '...more'}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Row */}
              <div className={`flex items-center justify-between transition-all duration-500 delay-200 ease-out ${buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleMethodsClick(); }}
                  className="bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>{language === 'nl' ? 'Bekijk methodes' : 'View methods'}</span>
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div >

      {/* Footer CTA buttons */}
      < FooterCTAGlass />
    </>
  );
};

export default OzlemDuralPage;
