import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface TrajectCardGlassProps {
  className?: string;
}

export const TrajectCardGlass = ({ className = '' }: TrajectCardGlassProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activePhase, setActivePhase] = useState<'pre' | 'treatment' | 'after'>('treatment');

  const steps = {
    pre: [
      { id: 1, title: 'Voorbehandeling' },
      { id: 2, title: 'Vitaminekuur' },
      { id: 3, title: 'Circulation Massage' },
    ],
    treatment: [
      { id: 4, title: 'Extractie van grafts' },
      { id: 5, title: 'Kanaalopening met saffiermesjes' },
      { id: 6, title: 'Implantatie met DHI-methode' },
    ],
    after: [
      { id: 7, title: 'Eerste controle' },
      { id: 8, title: 'Nazorginstructie' },
      { id: 9, title: 'V6 Hairboost-sessie' },
    ],
  };

  const handlePhaseChange = (phase: 'pre' | 'treatment' | 'after') => {
    setActivePhase(phase);
  };

  const handleMethodsClick = () => {
    navigate(language === 'nl' ? '/nl/haartransplantatie/nl/standard' : '/en/hair-transplant/en/standard');
  };

  return (
    <section
      className={`traject-card gold-gradient-border relative rounded-3xl transition-all duration-500 ${className}`}
      aria-label="Trajectory information"
      style={{
        marginTop: 'clamp(0.25rem, 0.5vh, 0.5rem)',
        background: 'linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.17))',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        marginLeft: '.1rem',
        marginRight: '.1rem',
        padding: '10px 10px 0',
        minHeight: '26vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Phase toggle */}
      <div 
        className="flex gap-0 justify-center mb-1.5 mx-auto border border-white/20"
        role="tablist" 
        aria-label="Phase"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '9999px',
          padding: '2px',
          width: 'fit-content',
        }}
      >
        <button 
          className={`rounded-full text-[9px] font-light transition-all duration-300 ease-out ${
            activePhase === 'pre' 
              ? 'silver-gradient-border bg-white/10 text-white scale-105' 
              : 'bg-transparent text-white/50 hover:text-white/70 scale-100'
          }`}
          style={{ 
            paddingTop: '0.4rem', 
            paddingBottom: '0.4rem',
            width: '60px',
            minWidth: '60px'
          }}
          onClick={() => handlePhaseChange('pre')}
        >
          Pre-
        </button>
        <button 
          className={`rounded-full text-[9px] font-light transition-all duration-300 ease-out ${
            activePhase === 'treatment' 
              ? 'silver-gradient-border bg-white/10 text-white scale-105' 
              : 'bg-transparent text-white/50 hover:text-white/70 scale-100'
          }`}
          style={{ 
            paddingTop: '0.4rem', 
            paddingBottom: '0.4rem',
            width: '60px',
            minWidth: '60px'
          }}
          onClick={() => handlePhaseChange('treatment')}
        >
          Treatment
        </button>
        <button 
          className={`rounded-full text-[9px] font-light transition-all duration-300 ease-out ${
            activePhase === 'after' 
              ? 'silver-gradient-border bg-white/10 text-white scale-105' 
              : 'bg-transparent text-white/50 hover:text-white/70 scale-100'
          }`}
          style={{ 
            paddingTop: '0.4rem', 
            paddingBottom: '0.4rem',
            width: '60px',
            minWidth: '60px'
          }}
          onClick={() => handlePhaseChange('after')}
        >
          After-
        </button>
      </div>

      {/* Content area with timeline */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px' }}>
        {/* Duration */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 'clamp(10px, 1.2vh, 12px)',
          fontWeight: 300,
          paddingLeft: '4px',
        }}>
          ⏱ Duur 30 min
        </div>

        {/* Timeline */}
        <div 
          className="timeline-container"
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            paddingBottom: '8px',
            paddingLeft: '4px',
            paddingRight: '4px',
          }}
        >
          {steps[activePhase].map((step, index) => (
            <div 
              key={step.id}
              className="timeline-step"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                minWidth: '120px',
                position: 'relative',
              }}
            >
              {/* Connecting line */}
              {index < steps[activePhase].length - 1 && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: 'calc(50% + 16px)',
                    width: '24px',
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.2)',
                  }}
                />
              )}

              {/* Step dot */}
              <div 
                className="silver-gradient-border"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 400,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </div>

              {/* Step title */}
              <div style={{
                color: 'white',
                fontSize: 'clamp(9px, 1.1vh, 11px)',
                fontWeight: 300,
                textAlign: 'center',
                lineHeight: 1.3,
              }}>
                {step.title}
              </div>

              {/* Step label */}
              <div style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: 'clamp(8px, 1vh, 10px)',
                fontWeight: 300,
              }}>
                Stap {index + 1}.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="traject-footer profile-border-top"
        aria-label="Navigation"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '9px 0px',
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.03) 100%)',
          marginTop: 'auto',
          marginLeft: '-10px',
          marginRight: '-10px',
          width: 'calc(100% + 20px)',
        }}
      >
        <button 
          onClick={handleMethodsClick}
          className="methods-link"
          style={{ 
            background: 'none',
            border: 'none',
            color: 'white',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 'clamp(10px, 1.2vh, 13px)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            cursor: 'pointer',
            padding: 0,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {language === 'nl' ? 'Methodes' : 'Methods'}
        </button>
      </footer>

      <style>{`
        .timeline-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        .timeline-container::-webkit-scrollbar {
          height: 4px;
        }

        .timeline-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .timeline-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .timeline-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

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

        .gold-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(130deg,
            #DDB961 0%,
            #E3C06B 25%,
            #EFECE6 50%,
            #EFCF7C 75%,
            #D8AF58 100%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .traject-card > * {
          position: relative;
          z-index: 1;
        }

        .profile-border-top::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(80deg, #949494 7%, #838e94 16%, #b5b5b5 34%, #ACB9C1 51%, #4e5964 78%, #727272 105%);
          z-index: 3;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
};
