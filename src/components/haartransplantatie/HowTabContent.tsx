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
        return '0%';
      case 'Treatment':
        return '50%';
      case 'After-':
        return '100%';
    }
  };

  return (
    <div className="h-full w-full overflow-hidden px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col items-center" style={{ gap: 'clamp(0.75rem, 2vh, 1.5rem)' }}>
        {/* Phase Selector */}
        <div 
          className="relative flex items-center justify-center gap-0 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 'clamp(0.25rem, 0.5vh, 0.375rem)',
          }}
        >
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`relative rounded-full text-sm font-light transition-all duration-300 ${
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
                padding: 'clamp(0.375rem, 1vh, 0.625rem) clamp(1.5rem, 3vw, 2rem)',
                fontSize: 'clamp(0.75rem, 1.5vh, 0.875rem)',
              }}
            >
              {phase}
            </button>
          ))}
        </div>

        {/* Video */}
        <div 
          className="w-full relative rounded-lg overflow-hidden" 
          style={{ 
            aspectRatio: '3/4',
            maxHeight: 'clamp(250px, 45vh, 400px)',
            width: 'auto',
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
          className="text-white/70 text-center"
          style={{
            fontSize: 'clamp(9px, 1.2vh, 10px)',
            fontWeight: 400,
            fontFamily: 'Inter',
          }}
        >
          Inmiddels heb ik al drie vrienden doorverwezen. GlobalHair maakt meer waar dan ze beloven.
        </p>

        {/* Timeline */}
        <div className="w-full relative bg-white/20 rounded-full" style={{ height: 'clamp(3px, 0.5vh, 4px)' }}>
          <div
            className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-500 ease-out"
            style={{
              left: getTimelinePosition(),
              transform: `translate(-50%, -50%)`,
              width: 'clamp(10px, 1.5vh, 12px)',
              height: 'clamp(10px, 1.5vh, 12px)',
            }}
          />
        </div>

        {/* Link */}
        <a
          href="#"
          className="text-white hover:text-white/80 transition-colors"
          style={{
            fontSize: 'clamp(10px, 1.3vh, 11px)',
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
