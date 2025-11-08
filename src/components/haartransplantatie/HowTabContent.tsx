import { useState, useMemo, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

type Phase = 'Pre-' | 'Treatment' | 'After-';

export const HowTabContent = () => {
  const { language } = useLanguage();
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

  // Timeline clip-path for journey effect
  const getTimelineClipPath = () => {
    switch (activePhase) {
      case 'Pre-':
        return 'inset(0 0 0 50%)'; // Show right half - journey starts
      case 'Treatment':
        return 'inset(0 0 0 0)'; // Show full line - in the middle
      case 'After-':
        return 'inset(0 50% 0 0)'; // Show left half - journey ends
    }
  };

  // Dynamic content per phase
  const getPhaseContent = () => {
    switch (activePhase) {
      case 'Pre-':
        return {
          quote: "De haarscan was super professioneel. <br />Ze namen alle tijd om mijn verwachtingen te bespreken.",
        };
      case 'Treatment':
        return {
          quote: "Inmiddels heb ik al drie vrienden doorverwezen. <br />GlobalHair maakt meer waar dan ze beloven.",
        };
      case 'After-':
        return {
          quote: "Na 6 maanden zie ik geweldige resultaten. <br />Ik voel me een stuk zelfverzekerder!",
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
    setTimeout(() => setIsTransitioning(false), 600);
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

  const timelineClipPath = getTimelineClipPath();
  const phaseContent = getPhaseContent();

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-hidden flex flex-col items-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full flex flex-col items-center px-4" style={{ gap: 'clamp(0.3rem, 0.6vh, 0.5rem)' }}>
        {/* Phase Selector */}
        <div 
          className="relative flex items-center justify-center gap-1 rounded-full"
          style={{
            background: '#FFFFFF0D',
            backdropFilter: 'blur(20px)',
            border: '1px solid #FFFFFF12',
            borderRadius: '9999px',
            padding: '5px',
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
                padding: 'clamp(0.3rem, 0.8vh, 0.5rem) clamp(1rem, 2.5vw, 1.5rem)',
                fontSize: 'clamp(0.7rem, 1.3vh, 0.8rem)',
                backgroundColor: activePhase === phase ? '#00000033' : 'transparent',
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
            maxHeight: 'clamp(280px, 48vh, 400px)',
            width: 'auto',
            marginTop: '-30px',
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
            style={{ marginTop: '-30px', zIndex: -1 }}
          />
        </div>

        {/* Quote Text */}
        <p 
          key={activePhase}
          className={`text-white text-center max-w-xs mx-auto ${
            slideDirection === 'left' ? 'animate-slide-left' : 'animate-slide-right'
          }`}
          style={{
            fontSize: 'clamp(8px, 1vh, 9px)',
            fontWeight: 300,
            fontFamily: 'Inter',
            lineHeight: '1.3',
            marginTop: '-40px',
            marginBottom: '0px',
          }}
          dangerouslySetInnerHTML={{ __html: phaseContent.quote }}
        />

        {/* Journey Timeline */}
        <div className="w-full relative" style={{ height: 'clamp(12px, 2vh, 16px)', margin: 'clamp(8px, 1.5vh, 12px) 0' }}>
          {/* Line container with overflow */}
          <div className="absolute top-1/2 left-0 w-full overflow-hidden" style={{ height: '1px', transform: 'translateY(-50%)' }}>
            <div
              className="absolute top-0 left-0 w-full bg-white transition-all"
              style={{
                height: '1px',
                clipPath: timelineClipPath,
                transitionDuration: '600ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
          
          {/* Fixed center dot - always visible */}
          <div
            className="absolute top-1/2 left-1/2 bg-white rounded-full"
            style={{
              transform: 'translate(-50%, -50%)',
              width: 'clamp(8px, 1.2vh, 10px)',
              height: 'clamp(8px, 1.2vh, 10px)',
              boxShadow: '0px 0px 6.8px 3px #FFFFFF40',
              zIndex: 10,
            }}
          />
        </div>

        {/* Link */}
        <a
          href="#"
          className="text-white hover:text-white/80 transition-colors"
          style={{
            fontSize: 'clamp(11px, 1.4vh, 12px)',
            fontWeight: 300,
            fontFamily: 'Inter',
            textDecoration: 'underline',
            marginTop: '1px',
          }}
        >
          Bekijk onze methodes
        </a>
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

        @keyframes slide-in-from-right {
          from {
            opacity: 0;
            transform: translateX(80px) scale(0.85);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slide-in-from-left {
          from {
            opacity: 0;
            transform: translateX(-80px) scale(0.85);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .animate-slide-left {
          animation: slide-in-from-right 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-slide-right {
          animation: slide-in-from-left 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};
