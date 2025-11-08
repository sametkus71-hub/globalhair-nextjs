import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';

type Phase = 'Pre-' | 'Treatment' | 'After-';

export const HowTabContent = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { heightBreakpoint } = useViewportHeight();
  const [activePhase, setActivePhase] = useState<Phase>('Treatment');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect iOS/Safari for proper video format
  const isIOSorSafari = useMemo(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return isIOS || isSafari;
  }, []);

  const phases: Phase[] = ['Pre-', 'Treatment', 'After-'];

  // Get position percentage for each phase within 300% wide container
  const getPhasePosition = (phase: Phase) => {
    switch (phase) {
      case 'Pre-':
        return 16.67;  // Center of first third
      case 'Treatment':
        return 50;     // Center of second third
      case 'After-':
        return 83.33;  // Center of third third
    }
  };

  // Calculate translation to center active phase in viewport
  const getTranslateX = () => {
    switch (activePhase) {
      case 'Pre-':
        return 0;      // Show left section
      case 'Treatment':
        return 33.33;  // Show middle section
      case 'After-':
        return 66.67;  // Show right section
    }
  };

  // Get line fill percentage based on active phase
  const getLineFillPercentage = () => {
    return getPhasePosition(activePhase);
  };

  // Get content for specific phase
  const getPhaseContent = (phase: Phase) => {
    switch (phase) {
      case 'Pre-':
        return {
          quote: "Vooraf krijgt u de eerste V6 Hairboost-behandeling om de haarzakjes te versterken.<br />U bereidt zich vijf dagen voor zonder nicotine, alcohol of bloedverdunners.",
        };
      case 'Treatment':
        return {
          quote: "Tijdens de behandeling worden gezonde haarzakjes verplaatst naar de kalende zones.<br />De ingreep gebeurt onder lokale verdoving en duurt gemiddeld 6 tot 8 uur.",
        };
      case 'After-':
        return {
          quote: "Na de transplantatie kunt u dezelfde dag naar huis.<br />Na 3 dagen rust hervat u lichte activiteiten en na 1 week kunt u weer werken.",
        };
    }
  };

  // Change phase with transition lock
  const changePhase = (newPhase: Phase) => {
    if (isTransitioning || newPhase === activePhase) return;
    
    const currentIndex = phases.indexOf(activePhase);
    const newIndex = phases.indexOf(newPhase);
    
    // Determine slide direction based on index comparison
    setSlideDirection(newIndex > currentIndex ? 'left' : 'right');
    
    setIsTransitioning(true);
    setActivePhase(newPhase);
    setTimeout(() => setIsTransitioning(false), 1200);
  };

  // Navigate to next/previous phase
  const goToNextPhase = () => {
    const currentIndex = phases.indexOf(activePhase);
    if (currentIndex < phases.length - 1) {
      changePhase(phases[currentIndex + 1]);
    }
  };

  const goToPreviousPhase = () => {
    const currentIndex = phases.indexOf(activePhase);
    if (currentIndex > 0) {
      changePhase(phases[currentIndex - 1]);
    }
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swiped left - go to next
        goToNextPhase();
      } else {
        // Swiped right - go to previous
        goToPreviousPhase();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousPhase();
      } else if (e.key === 'ArrowRight') {
        goToNextPhase();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhase]);

  const lineFillPercentage = getLineFillPercentage();
  const translateX = getTranslateX();

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-hidden flex flex-col items-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full flex flex-col items-center px-4" style={{ 
        gap: heightBreakpoint === 'small' 
          ? 'clamp(0.2rem, 0.4vh, 0.3rem)'
          : 'clamp(0.3rem, 0.6vh, 0.5rem)' 
      }}>
        {/* Phase Selector */}
        <div 
          className="relative flex items-center justify-center gap-1 rounded-full"
          style={{
            background: '#FFFFFF0D',
            backdropFilter: 'blur(20px)',
            border: '1px solid #FFFFFF12',
            borderRadius: '9999px',
            padding: '3px',
            zIndex: 10,
          }}
        >
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => changePhase(phase)}
              disabled={isTransitioning}
              className={`relative rounded-full font-light transition-all duration-300 ease-out ${
                activePhase === phase
                  ? 'silver-gradient-border scale-105'
                  : 'bg-transparent hover:opacity-80 scale-100'
              }`}
              style={{
                padding: 'clamp(0.2rem, 0.5vh, 0.35rem) clamp(1rem, 2.5vw, 1.5rem)',
                fontSize: 'clamp(0.7rem, 1.3vh, 0.8rem)',
                backgroundColor: activePhase === phase ? 'rgba(24, 47, 60, 0.3)' : 'transparent',
                backgroundImage: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {phase}
            </button>
          ))}
        </div>

        {/* Video */}
        <div 
          className="relative rounded-lg overflow-hidden mx-auto" 
          style={{ 
            aspectRatio: '3/4',
            maxHeight: heightBreakpoint === 'small' 
              ? 'clamp(220px, 38vh, 300px)'
              : heightBreakpoint === 'medium'
              ? 'clamp(250px, 43vh, 350px)'
              : 'clamp(280px, 48vh, 400px)',
            width: 'auto',
            marginTop: heightBreakpoint === 'small' ? '-20px' : '-30px',
          }}
        >
          <video
            key={isIOSorSafari ? 'mp4' : 'webm'}
            src={isIOSorSafari 
              ? "https://GlobalHair.b-cdn.net/Male%201K%20HT%20WEB.mp4"
              : "https://GlobalHair.b-cdn.net/Male%201K%20HT%20WEB.webm"
            }
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ marginTop: heightBreakpoint === 'small' ? '-20px' : '-30px', zIndex: -1 }}
          />
        </div>

        {/* Journey Timeline Container */}
        <div className="w-full relative" style={{ 
          marginTop: heightBreakpoint === 'small' ? 'clamp(6px, 1vh, 8px)' : 'clamp(8px, 1.5vh, 12px)',
          marginBottom: heightBreakpoint === 'small' ? 'clamp(3px, 0.5vh, 4px)' : 'clamp(4px, 0.75vh, 6px)',
        }}>
          {/* Text - Separate viewport wrapper (above the line) */}
          <div className="w-full overflow-hidden relative" style={{ marginBottom: '8px', minHeight: 'clamp(40px, 8vh, 60px)' }}>
            <div 
              className="relative transition-transform" 
              style={{ 
                width: '300%',
                height: '100%',
                transform: `translateX(-${translateX}%)`,
                transitionDuration: '900ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* All 3 texts rendered simultaneously */}
              {phases.map((phase) => {
                const position = getPhasePosition(phase);
                const isActive = phase === activePhase;
                const content = getPhaseContent(phase);

                return (
                  <div
                    key={phase}
                    className="absolute transition-opacity"
                    style={{
                      left: `${position}%`,
                      top: 0,
                      transform: 'translateX(-50%)',
                      opacity: isActive ? 1 : 0.3,
                      width: 'clamp(200px, 70vw, 400px)',
                      textAlign: 'center',
                      transitionDuration: '900ms',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <p 
                      className="text-white"
                      style={{
                        fontSize: 'clamp(8px, 1vh, 9px)',
                        fontWeight: 300,
                        fontFamily: 'Inter',
                        lineHeight: '1.3',
                      }}
                      dangerouslySetInnerHTML={{ __html: content.quote }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots and Line - Viewport wrapper */}
          <div className="w-full overflow-hidden relative" style={{ height: 'clamp(30px, 4vh, 40px)' }}>
            <div 
              className="relative transition-transform" 
              style={{ 
                width: '300%',
                height: '100%',
                transform: `translateX(-${translateX}%)`,
                transitionDuration: '900ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Base line (unfilled) - starts at first dot, ends at last dot */}
              <div 
                className="absolute top-1/2" 
                style={{ 
                  left: '16.67%',
                  width: '66.66%',
                  height: '1px', 
                  transform: 'translateY(-50%)' 
                }}
              >
                <div style={{ width: '100%', height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
              </div>

              {/* Filled line (progressive) - grows from first dot to active dot */}
              <div 
                className="absolute top-1/2" 
                style={{ 
                  left: '16.67%',
                  height: '1px', 
                  transform: 'translateY(-50%)' 
                }}
              >
                <div
                  className="transition-all"
                  style={{
                    width: `${lineFillPercentage - 16.67}%`,
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 1) 100%)',
                    transitionDuration: '900ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
              
              {/* Three journey dots */}
              {phases.map((phase) => {
                const position = getPhasePosition(phase);
                const isActive = phase === activePhase;
                const currentIndex = phases.indexOf(activePhase);
                const dotIndex = phases.indexOf(phase);
                const isCompleted = dotIndex < currentIndex;

                return (
                  <div
                    key={phase}
                    className="absolute top-1/2 bg-white rounded-full transition-all cursor-pointer"
                    style={{
                      left: `${position}%`,
                      transform: `translate(-50%, -50%) scale(${isActive ? 1.4 : 0.8})`,
                      width: 'clamp(8px, 1.2vh, 10px)',
                      height: 'clamp(8px, 1.2vh, 10px)',
                      opacity: isActive ? 1 : isCompleted ? 0.6 : 0.3,
                      boxShadow: isActive ? '0px 0px 12px 4px rgba(255, 255, 255, 0.5)' : 'none',
                      zIndex: isActive ? 20 : 10,
                      transitionDuration: '900ms',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onClick={() => changePhase(phase)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Link */}
        <button
          onClick={() => {
            if (typeof document !== 'undefined') document.body.classList.add('popup-open');
            navigate('/nl/haartransplantatie/nl/premium');
          }}
          className="text-white hover:text-white/80 transition-colors cursor-pointer"
          style={{
            fontSize: 'clamp(11px, 1.4vh, 12px)',
            fontWeight: 300,
            fontFamily: 'Inter',
            textDecoration: 'underline',
            marginTop: '1px',
            background: 'none',
            border: 'none',
            padding: 0,
          }}
        >
          Bekijk onze methodes
        </button>
      </div>

      <style>{`
        .silver-gradient-border {
          position: relative;
        }

        .silver-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(80deg, #949494 7%, #838e94 16%, #b5b5b5 34%, #ACB9C1 51%, #4e5964 78%, #727272 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .silver-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        @keyframes fade-scale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-scale {
          animation: fade-scale 900ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};
