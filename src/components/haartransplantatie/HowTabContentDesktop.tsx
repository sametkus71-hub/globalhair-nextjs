import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

type Phase = 'Pre-' | 'Treatment' | 'After-';

export const HowTabContentDesktop = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activePhase, setActivePhase] = useState<Phase>('Treatment');

  // Detect iOS/Safari for proper video format
  const isIOSorSafari = useMemo(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return isIOS || isSafari;
  }, []);

  const phases: Phase[] = ['Pre-', 'Treatment', 'After-'];

  // Get content for specific phase
  const getPhaseContent = (phase: Phase) => {
    switch (phase) {
      case 'Pre-':
        return {
          quote: "Inmiddels heb ik al drie vrienden doorverwezen.<br />GlobalHair maakt meer waar dan ze beloven.",
        };
      case 'Treatment':
        return {
          quote: "Inmiddels heb ik al drie vrienden doorverwezen.<br />GlobalHair maakt meer waar dan ze beloven.",
        };
      case 'After-':
        return {
          quote: "Inmiddels heb ik al drie vrienden doorverwezen.<br />GlobalHair maakt meer waar dan ze beloven.",
        };
    }
  };

  // Get position percentage for timeline
  const getPhasePosition = (phase: Phase) => {
    switch (phase) {
      case 'Pre-':
        return 0;
      case 'Treatment':
        return 50;
      case 'After-':
        return 100;
    }
  };

  const getLineFillPercentage = () => {
    return getPhasePosition(activePhase);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20 px-8">
      {/* Video Section - First */}
      <div className="w-full max-w-md mb-12 -mt-[100px]">
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
          className="w-full h-auto"
        />
      </div>

      {/* Timeline with Labels - Spread across */}
      <div className="w-full max-w-5xl mb-8 relative">
        <div className="relative w-full h-12 flex items-center">
          {/* Single gradient line with shine effect */}
          <div 
            className="absolute w-full h-px transition-all duration-500" 
            style={{ 
              left: '0%',
              width: '100%',
              background: `linear-gradient(to right, 
                rgba(255, 255, 255, 0.2) 0%, 
                rgba(255, 255, 255, 0.4) ${getPhasePosition(activePhase) - 10}%, 
                rgba(255, 255, 255, 0.8) ${getPhasePosition(activePhase)}%, 
                rgba(255, 255, 255, 0.4) ${getPhasePosition(activePhase) + 10}%, 
                rgba(255, 255, 255, 0.2) 100%)`,
              top: '50%',
              transform: 'translateY(-50%)'
            }} 
          />

          {/* Phase labels in pills */}
          {phases.map((phase) => {
            const isActive = activePhase === phase;
            const position = getPhasePosition(phase);
            
            return (
              <div
                key={phase}
                className="absolute flex flex-col items-center cursor-pointer"
                style={{ 
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                  top: '50%',
                  marginTop: '-20px'
                }}
                onClick={() => setActivePhase(phase)}
              >
                {/* Pill Label */}
                <div
                  className={`rounded-full transition-all duration-300 ${isActive ? 'silver-gradient-border px-4 py-1' : 'px-4 py-1'}`}
                  style={{
                    background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(50, 50, 50, 0.3)',
                    border: isActive ? 'none' : 'none',
                    backdropFilter: isActive ? 'blur(10px)' : 'blur(20px)',
                  }}
                >
                  <span 
                    className="text-white transition-all duration-300 whitespace-nowrap"
                    style={{
                      fontSize: isActive ? '14px' : '12px',
                      fontWeight: 300,
                      fontFamily: 'Inter',
                      opacity: isActive ? 1 : 0.9,
                    }}
                  >
                    {phase === 'After-' ? 'After' : phase}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Three Description Boxes - All visible */}
      <div className="w-full max-w-5xl grid grid-cols-3 gap-6 mb-12">
        {phases.map((phase) => {
          const isActive = activePhase === phase;
          const content = getPhaseContent(phase);
          
          return (
            <div
              key={phase}
              className="relative transition-all duration-500"
              style={{
                filter: isActive ? 'none' : 'blur(5px)',
                opacity: isActive ? 1 : 0.9,
              }}
            >
              <div
                className="rounded-lg p-6 text-center"
                style={{
                  background: isActive ? '#FFFFFF0D' : 'transparent',
                  backdropFilter: isActive ? 'blur(20px)' : 'none',
                  border: isActive ? '1px solid #FFFFFF30' : 'none',
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  className="text-white"
                  style={{
                    fontSize: '14px',
                    fontWeight: 300,
                    fontFamily: 'Inter',
                    lineHeight: '1.5',
                  }}
                  dangerouslySetInnerHTML={{ __html: content.quote }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Right Link - Same styling as mobile */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => {
            if (typeof document !== 'undefined') document.body.classList.add('popup-open');
            navigate(`/${language}/haartransplantatie/premium`);
          }}
          className="text-white hover:text-white/80 transition-colors cursor-pointer"
          style={{
            fontSize: '14px',
            fontWeight: 300,
            fontFamily: 'Inter',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            padding: 0,
          }}
        >
          Bekijk onze methodes
        </button>
      </div>

      {/* Styles for gradient border */}
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
          background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
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
      `}</style>
    </div>
  );
};
