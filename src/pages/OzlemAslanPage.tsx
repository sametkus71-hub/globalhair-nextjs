import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OZLEM_VIDEO } from '@/data/ozlemVideos';
import { useLanguage } from '@/hooks/useLanguage';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { MetaHead } from '@/components/MetaHead';

const OzlemAslanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
      <MetaHead
        title="Özlem Aslan - Operational Manager GlobalHair Institute"
        description="Als Operational Manager van GlobalHair Institute zorgt Özlem Aslan ervoor dat elke cliënt een naadloze en persoonlijke ervaring krijgt."
        language={language}
      />
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
              muted={false}
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
            
            {/* Close button inside modal */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center transition-all duration-200 hover:opacity-80 rounded-full"
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
            
            {/* Title at top */}
            <div className={`relative z-10 text-center transition-all duration-500 ease-out pt-8 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[0.85] tracking-wide">
                ÖZLEM
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[0.85] tracking-wide font-medium">
                ASLAN
              </h1>
            </div>

            {/* Description and Buttons at bottom */}
            <div className="relative z-10 space-y-6 mt-auto">
              <div className={`max-w-md transition-all duration-500 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <p className="text-xs leading-relaxed font-normal text-left text-white/90 font-inter">
                  {OZLEM_VIDEO.description}
                </p>
              </div>

              {/* Bottom Button */}
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

export default OzlemAslanPage;
