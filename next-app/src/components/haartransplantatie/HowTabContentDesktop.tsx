'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/hooks/useLanguage';

type Phase = 'Pre-' | 'Treatment' | 'After-';

export const HowTabContentDesktop = () => {
  const router = useRouter();
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
          quote: "Vooraf krijgt u de eerste V6 Hairboost®-<br />behandeling om de haarzakjes te versterken.<br />U bereidt zich vijf dagen voor zonder nicotine,<br />alcohol of bloedverdunners.",
        };
      case 'Treatment':
        return {
          quote: "Tijdens de behandeling worden gezonde<br />haarzakjes verplaatst naar de kalende zones.<br />De ingreep gebeurt onder lokale verdoving en<br />duurt gemiddeld 6 tot 8 uur.",
        };
      case 'After-':
        return {
          quote: "Na de transplantatie (in Nederland) kunt u dezelfde dag naar<br />huis. Na 3 dagen rust hervat u lichte activiteiten<br />en na 1 week kunt u weer werken.",
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
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20 px-8 overflow-visible">
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
      <div className="w-full mb-8 relative overflow-visible">
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
              <button
                key={phase}
                className="absolute flex flex-col items-center cursor-pointer group"
                style={{ 
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                  top: '50%',
                  marginTop: '-17px'
                }}
                onClick={() => setActivePhase(phase)}
              >
                {/* Pill Label */}
                <div
                  className={`rounded-full transition-all duration-300 ${isActive ? 'silver-gradient-border scale-110' : 'group-hover:scale-105'}`}
                  style={{
                    padding: isActive ? '4px 16px' : '3px 19px',
                    background: isActive 
                      ? 'rgba(40, 40, 40, 0.4)' 
                      : 'linear-gradient(135deg, rgba(80, 80, 80, 0.25) 0%, rgba(120, 120, 120, 0.15) 50%, rgba(80, 80, 80, 0.25) 100%)',
                    border: isActive ? 'none' : 'none',
                    backdropFilter: isActive ? 'blur(10px)' : 'blur(20px)',
                    boxShadow: isActive 
                      ? 'inset 0 1px 2px rgba(255, 255, 255, 0.1)' 
                      : 'inset 0 1px 2px rgba(255, 255, 255, 0.05), 0 0 0 0px rgba(255, 255, 255, 0)',
                  }}
                >
                  <span 
                    className="text-white transition-all duration-300 whitespace-nowrap group-hover:opacity-100"
                    style={{
                      fontSize: isActive ? '14px' : '12px',
                      fontWeight: 300,
                      fontFamily: 'Inter',
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {phase === 'After-' ? '-After' : phase}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Three Description Boxes - All visible */}
      <div className="w-full grid grid-cols-3 gap-6 mb-12 overflow-visible">
        {phases.map((phase, index) => {
          const isActive = activePhase === phase;
          const content = getPhaseContent(phase);
          
          return (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`relative transition-all duration-200 ease-out ${!isActive && 'cursor-pointer group'}`}
              style={{
                filter: isActive ? 'none' : 'blur(4px)',
                opacity: isActive ? 1 : 0.6,
                marginLeft: index === 0 ? '-60px' : '0',
                marginRight: index === 2 ? '-60px' : '0',
              }}
            >
              <div
                className={`transition-all duration-700 ease-out ${isActive ? 'description-gradient-border' : ''}`}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                  backdropFilter: isActive ? 'blur(31.2px)' : 'none',
                  border: 'none',
                  borderRadius: isActive ? '4px' : '8px',
                  padding: isActive ? '10px' : '24px',
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  className="text-white transition-opacity duration-300"
                  style={{
                    fontSize: '14px',
                    fontWeight: 300,
                    fontFamily: 'Inter',
                    lineHeight: '1.5',
                    textAlign: 'center',
                  }}
                  dangerouslySetInnerHTML={{ __html: content.quote }}
                />
              </div>
            </button>
          );
        })}
      </div>
      {/* Bottom Right Link - Rendered via Portal to escape stacking context */}
      {createPortal(
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => {
              if (typeof document !== 'undefined') document.body.classList.add('popup-open');
              router.push('/nl/haartransplantatie/nl/premium');
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
        </div>,
        document.body
      )}
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

        /* Description gradient border for active state */
        .description-gradient-border {
          position: relative;
        }

        .description-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(269.87deg, #4B555E 3.18%, #ACB9C1 51.79%, #FFFFFF 76.09%, #ACB9C1 88.24%, #4B555E 100.39%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .description-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        /* Hover effect for inactive items */
        .group:hover .rounded-full:not(.silver-gradient-border) {
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.3) !important;
          background: linear-gradient(135deg, rgba(100, 100, 100, 0.35) 0%, rgba(140, 140, 140, 0.25) 50%, rgba(100, 100, 100, 0.35) 100%) !important;
        }

        /* Hover effect only for inactive description boxes */
        button.group:hover {
          filter: none !important;
          opacity: 1 !important;
        }

        button.group:hover .rounded-lg {
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          background: transparent !important;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};
