import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

type Phase = 'Pre-' | 'Treatment' | 'After-';

export const HowTabContent = () => {
  const { language } = useLanguage();
  const [activePhase, setActivePhase] = useState<Phase>('Treatment');

  const phases: Phase[] = ['Pre-', 'Treatment', 'After-'];

  const getTimelinePosition = () => {
    switch (activePhase) {
      case 'Pre-':
        return '25%';
      case 'Treatment':
        return '50%';
      case 'After-':
        return '75%';
    }
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col items-center">
      <div className="w-full flex flex-col items-center px-4" style={{ gap: 'clamp(0.3rem, 0.6vh, 0.5rem)' }}>
        {/* Phase Selector */}
        <div 
          className="relative flex items-center justify-center gap-1 rounded-full border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            padding: '5px',
            zIndex: 10,
          }}
        >
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`relative rounded-full font-light transition-all duration-300 ease-out ${
                activePhase === phase
                  ? 'silver-gradient-border bg-white/10 text-white scale-105'
                  : 'bg-transparent text-white/50 hover:text-white/70 scale-100'
              }`}
              style={{
                padding: 'clamp(0.3rem, 0.8vh, 0.5rem) clamp(1rem, 2.5vw, 1.5rem)',
                fontSize: 'clamp(0.7rem, 1.3vh, 0.8rem)',
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
            src="https://GlobalHair.b-cdn.net/Male%201K%20HT%20WEB.webm"
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
          className="text-white text-center max-w-xs mx-auto"
          style={{
            fontSize: 'clamp(8px, 1vh, 9px)',
            fontWeight: 400,
            fontFamily: 'Inter',
            lineHeight: '1.3',
            marginTop: '-10px',
          }}
        >
          Inmiddels heb ik al drie vrienden doorverwezen. <br />GlobalHair maakt meer waar dan ze beloven.
        </p>

        {/* Timeline - Full Width */}
        <div className="w-full relative bg-white rounded-full" style={{ height: '1px', margin: '4px 0' }}>
          <div
            className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-500 ease-out"
            style={{
              left: getTimelinePosition(),
              transform: `translate(-50%, -50%)`,
              width: 'clamp(8px, 1.2vh, 10px)',
              height: 'clamp(8px, 1.2vh, 10px)',
              boxShadow: '0px 0px 6.8px 3px #FFFFFF40',
            }}
          />
        </div>

        {/* Link */}
        <a
          href="#"
          className="text-white hover:text-white/80 transition-colors"
          style={{
            fontSize: 'clamp(9px, 1.2vh, 10px)',
            fontWeight: 500,
            textDecoration: 'underline',
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
      `}</style>
    </div>
  );
};
