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
    <div className="h-full w-full overflow-y-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto space-y-6 flex flex-col items-center">
        {/* Phase Selector */}
        <div 
          className="relative flex items-center justify-center gap-0 p-1.5 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`relative px-8 py-2.5 rounded-full text-sm font-light transition-all duration-300 ${
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
              }}
            >
              {phase}
            </button>
          ))}
        </div>

        {/* Video */}
        <div className="w-full aspect-[3/4] max-w-md relative rounded-lg overflow-hidden">
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
            fontSize: '10px',
            fontWeight: 400,
            fontFamily: 'Inter',
          }}
        >
          Inmiddels heb ik al drie vrienden doorverwezen. GlobalHair maakt meer waar dan ze beloven.
        </p>

        {/* Timeline */}
        <div className="w-full relative h-1 bg-white/20 rounded-full">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-all duration-500 ease-out"
            style={{
              left: getTimelinePosition(),
              transform: `translate(-50%, -50%)`,
            }}
          />
        </div>

        {/* Link */}
        <a
          href="#"
          className="text-white hover:text-white/80 transition-colors"
          style={{
            fontSize: '11px',
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
