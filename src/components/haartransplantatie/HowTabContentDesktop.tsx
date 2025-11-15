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
        return 16.67;
      case 'Treatment':
        return 50;
      case 'After-':
        return 83.33;
    }
  };

  const getLineFillPercentage = () => {
    return getPhasePosition(activePhase);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20 px-8">
      {/* Video Section - First */}
      <div className="w-full max-w-md mb-12">
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
          {/* Background line */}
          <div 
            className="absolute w-full h-px" 
            style={{ 
              left: '16.67%',
              right: '16.67%',
              width: '66.66%',
              background: 'rgba(255, 255, 255, 0.2)',
              top: '50%',
              transform: 'translateY(-50%)'
            }} 
          />
          
          {/* Filled line */}
          <div 
            className="absolute h-px transition-all duration-500"
            style={{ 
              left: '16.67%',
              width: `${getLineFillPercentage() - 16.67}%`,
              background: 'linear-gradient(to right, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 1) 100%)',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />

          {/* Phase labels and dots */}
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
                  marginTop: '-24px'
                }}
                onClick={() => setActivePhase(phase)}
              >
                {/* Dot */}
                <div
                  className="rounded-full bg-white transition-all duration-300 mb-2"
                  style={{
                    width: isActive ? '12px' : '8px',
                    height: isActive ? '12px' : '8px',
                    opacity: isActive ? 1 : 0.3,
                    boxShadow: isActive ? '0px 0px 6px 2px rgba(255, 255, 255, 0.25)' : 'none',
                  }}
                />
                {/* Label */}
                <span 
                  className="text-white transition-all duration-300"
                  style={{
                    fontSize: '14px',
                    fontWeight: 300,
                    fontFamily: 'Inter',
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  {phase === 'After-' ? '-After' : phase}
                </span>
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
                filter: isActive ? 'none' : 'blur(3px)',
                opacity: isActive ? 1 : 0.5,
              }}
            >
              <div
                className="rounded-lg p-6 text-center"
                style={{
                  background: '#FFFFFF0D',
                  backdropFilter: 'blur(20px)',
                  border: isActive ? '1px solid #FFFFFF30' : '1px solid #FFFFFF12',
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
    </div>
  );
};
