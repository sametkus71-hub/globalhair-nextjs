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
          className="relative flex items-center justify-center gap-0 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 'clamp(0.2rem, 0.4vh, 0.3rem)',
          }}
        >
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`relative rounded-full font-light transition-all duration-300 ${
                activePhase === phase
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
              style={{
                background: activePhase === phase
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'transparent',
                border: activePhase === phase
                  ? '1px solid rgba(255, 255, 255, 0.2)'
                  : '1px solid transparent',
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
            marginTop: '-40px',
          }}
        >
          <video
            src="https://GlobalHair.b-cdn.net/Male%201K%20HT%20WEB.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
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
          }}
        >
          Inmiddels heb ik al drie vrienden doorverwezen. <br />GlobalHair maakt meer waar dan ze beloven.
        </p>

        {/* Timeline - Full Width */}
        <div className="w-full relative bg-white rounded-full" style={{ height: '1px' }}>
          <div
            className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-500 ease-out"
            style={{
              left: getTimelinePosition(),
              transform: `translate(-50%, -50%)`,
              width: 'clamp(8px, 1.2vh, 10px)',
              height: 'clamp(8px, 1.2vh, 10px)',
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
    </div>
  );
};
