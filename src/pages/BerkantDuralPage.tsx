import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, Camera } from 'lucide-react';
import { BERKANT_VIDEOS } from '@/data/berkantVideos';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

const BerkantDuralPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [searchParams, setSearchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(false);

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
    navigate(`/${language}/berkantdural?video=${nextVideoId}`);
    setNextButtonVisible(false);
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(`/${language}/haartransplantatie/mission`);
    }, 350);
  };

  const handleMethodsClick = () => {
    sessionStorage.setItem('previousPath', window.location.pathname);
    const homePath = language === 'nl' ? '/nl' : '/en';
    navigate(homePath);
  };

  // Handle video loading and staggered entrance animations
  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);
    const timer3 = setTimeout(() => setButtonVisible(true), 500);
    const timer4 = setTimeout(() => setNextButtonVisible(true), 8000);
    const timerEnter = setTimeout(() => setIsEntering(false), 450);

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timerEnter);
    };
  }, [video.id]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />
      
      <div className={`fixed inset-0 w-full h-full overflow-hidden ${isEntering ? 'berkant-page-enter' : ''} ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Video Background */}
        <video
          ref={videoRef}
          key={video.id}
          src={video.unsubbedUrl}
          autoPlay
          loop
          muted={false}
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/5 via-black/20 to-black/50"></div>
        
        {/* Close button with gradient border */}
        <button
          onClick={handleClose}
          className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center transition-all duration-200 hover:opacity-80 rounded-full"
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
            <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Content overlay */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 py-8 pb-[8vh] sm:pb-[10vh]">
          {/* Top container - Title */}
          <div className={`pt-6 text-center transition-all duration-500 ease-out ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[0.85] tracking-wide">
              BERKANT
            </h1>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[0.85] tracking-wide font-medium">
              DURAL
            </h1>
          </div>

          {/* Bottom container - Description and Buttons */}
          <div className="space-y-6">
            <div className={`max-w-md transition-all duration-500 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-xs leading-relaxed font-normal text-left text-white/90 font-inter">
                {video.description}
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
        </div>
      </div>
    </>
  );
};

export default BerkantDuralPage;
