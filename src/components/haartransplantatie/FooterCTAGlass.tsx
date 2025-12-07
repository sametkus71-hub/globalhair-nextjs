import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import chatIcon from '@/assets/chat-icon.svg';
import { useState, useEffect } from 'react';

export const FooterCTAGlass = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Check if we're returning from a popup (desktop only)
    if (!isMobile && sessionStorage.getItem('skipPageAnimations') === 'true') {
      setShouldAnimate(false);
    }
  }, [isMobile]);

  return (
    <>
      <div
        className="fixed left-0 right-0 bottom-0 z-40"
        style={{
          paddingTop: isMobile ? '1rem' : 'clamp(1rem, 2vh, 1.5rem)',
          paddingLeft: 'clamp(0.5rem, 1vw, 0.75rem)',
          paddingRight: 'clamp(0.5rem, 1vw, 0.75rem)',
          paddingBottom: isMobile 
            ? 'clamp(calc(env(safe-area-inset-bottom) + 0.5rem), calc(env(safe-area-inset-bottom) + 1vh), calc(env(safe-area-inset-bottom) + 1rem))'
            : 'clamp(calc(env(safe-area-inset-bottom) + 1.5rem), calc(env(safe-area-inset-bottom) + 2.5vh), calc(env(safe-area-inset-bottom) + 2rem))',
          animation: isMobile ? 'fade-up 0.6s ease-out 1.4s both' : (shouldAnimate ? 'fade-up 0.6s ease-out 1.4s both' : 'none'),
          background: 'linear-gradient(180deg, rgba(4, 14, 21, 0) 0%, rgba(4, 14, 21, 0.9) 100%)',
        }}
      >
        <div className={`flex items-center space-x-2 ${isMobile ? 'justify-between' : 'justify-center'}`}>
          {/* Book a consult button */}
          <button
            onClick={() => navigate(language === 'nl' ? '/nl/boek' : '/en/book')}
            className={`gold-gradient-border cta-button-glow ${isMobile ? 'flex-1' : ''} flex items-center rounded-full transition-all duration-200`}
            style={{
              padding: '0.4rem',
              width: isMobile ? undefined : '250px',
              background: 'linear-gradient(90deg, rgba(15, 25, 40, 0.7), rgba(35, 50, 70, 0.8), rgba(50, 65, 85, 0.75), rgba(35, 50, 70, 0.8), rgba(15, 25, 40, 0.7))',
              backgroundSize: '200% 100%',
              animation: 'background-gradient-shift 7s ease-in-out infinite',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 20px rgba(201, 163, 93, 0.35), 0 0 40px rgba(201, 163, 93, 0.15), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
              justifyContent: 'center',
              gap: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 25px rgba(201, 163, 93, 0.45), 0 0 50px rgba(201, 163, 93, 0.2), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 20px rgba(201, 163, 93, 0.35), 0 0 40px rgba(201, 163, 93, 0.15), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
            }}
          >
            {/* Shine sweep overlay */}
            <span
              className="shine-sweep"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,250,235,0) 0%, rgba(255,250,235,0.3) 50%, rgba(255,250,235,0) 100%)',
                transform: 'translateX(-100%) skewX(-15deg)',
                animation: 'shine-sweep 4.5s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
            
            <span
              className="text-shine-animated"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 300,
                letterSpacing: '0.01em',
                flex: 1,
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                color: 'white',
              }}
            >
              {language === 'nl' ? 'Book a consult' : 'Book a consult'}
            </span>
            
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 'auto',
              }}
            >
              <div
                className="silver-gradient-border rounded-full flex items-center justify-center"
                style={{
                  width: 'clamp(40px, 4.5vh, 46px)',
                  height: 'clamp(40px, 4.5vh, 46px)',
                  background: 'rgba(255, 255, 255, 0.10)',
                }}
              >
                <ArrowUpRight style={{ width: 'clamp(20px, 2.2vh, 22px)', height: 'clamp(20px, 2.2vh, 22px)' }} className="text-white" strokeWidth={2.5} />
              </div>
            </span>
          </button>

          {/* Chat button */}
          <button
            onClick={() => navigate(language === 'nl' ? '/nl/chat' : '/en/chat')}
            className="silver-gradient-border rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              width: 'clamp(48px, 5.5vh, 54px)',
              height: 'clamp(48px, 5.5vh, 54px)',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 15px rgba(172, 185, 193, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 20px rgba(172, 185, 193, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 15px rgba(172, 185, 193, 0.2)';
            }}
          >
            <img src={chatIcon} alt="Chat" style={{ width: 'clamp(18px, 2vh, 20px)', height: 'clamp(18px, 2vh, 20px)' }} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes background-gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes border-shine-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes champagne-float {
          0%, 100% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -52%) scale(1.03);
          }
        }

        @keyframes shine-sweep {
          0% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0;
          }
          50% {
            opacity: 0.2;
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
            opacity: 0;
          }
        }

        @keyframes text-shine-sweep {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }

        .text-shine-animated {
          position: relative;
          display: inline-block;
        }

        .text-shine-animated::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(172, 185, 193, 0.4) 25%, rgba(255, 255, 255, 0.6) 50%, rgba(172, 185, 193, 0.4) 75%, transparent 100%);
          animation: text-shine-sweep 4.5s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        .gold-gradient-border {
          position: relative;
        }

        .gold-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.3px;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #B8924A 0%,
            #C9A35D 15%,
            #E3C06B 30%,
            #FFFEF7 45%,
            #FFFEF7 50%,
            #FFFEF7 55%,
            #E3C06B 70%,
            #C9A35D 85%,
            #B8924A 100%
          );
          background-size: 400% 100%;
          animation: border-shine-rotate 4.5s ease-in-out infinite;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .gold-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        .cta-button-glow::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
          height: 85%;
          border-radius: 50%;
          background: radial-gradient(circle, #FFFEF7 0%, #E8DCC4 50%, transparent 100%);
          filter: blur(25px);
          opacity: 0.45;
          z-index: 1;
          pointer-events: none;
          animation: champagne-float 6s ease-in-out infinite;
        }

        .silver-gradient-border {
          position: relative;
        }

        .silver-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.3px;
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
    </>
  );
};
