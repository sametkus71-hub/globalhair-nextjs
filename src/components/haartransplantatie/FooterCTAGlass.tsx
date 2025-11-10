import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import chatIcon from '@/assets/chat-icon.svg';

export const FooterCTAGlass = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          paddingLeft: 'clamp(0.5rem, 1vw, 0.75rem)',
          paddingRight: 'clamp(0.5rem, 1vw, 0.75rem)',
          paddingBottom: 'clamp(calc(env(safe-area-inset-bottom) + 0.5rem), calc(env(safe-area-inset-bottom) + 1vh), calc(env(safe-area-inset-bottom) + 1rem))',
          animation: 'fade-up 0.6s ease-out 1.4s both',
          background: 'linear-gradient(180deg, rgba(4, 14, 21, 0) 0%, rgba(4, 14, 21, 0.9) 100%)',
        }}
      >
        <div className="flex items-center justify-between space-x-2">
          {/* Book a consult button */}
          <button
            onClick={() => navigate(language === 'nl' ? '/nl/boek' : '/en/book')}
            className="gold-gradient-border cta-button-glow flex-1 flex items-center rounded-full transition-all duration-200"
            style={{
              padding: '0.4rem',
              background: 'linear-gradient(90deg, rgba(20, 30, 48, 0.6), rgba(30, 40, 60, 0.7), rgba(25, 35, 55, 0.65), rgba(20, 30, 48, 0.6))',
              backgroundSize: '200% 100%',
              animation: 'background-gradient-shift 9s ease-in-out infinite',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
              justifyContent: 'center',
              gap: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
            }}
          >
            <span
              className="text-white"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 300,
                letterSpacing: '0.01em',
                flex: 1,
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
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
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
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

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
        }

        .gold-gradient-border {
          position: relative;
        }

        .gold-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #B8924A 0%,
            #C9A35D 15%,
            #E3C06B 30%,
            #F5E8C1 45%,
            #F4E4B8 50%,
            #F5E8C1 55%,
            #E3C06B 70%,
            #C9A35D 85%,
            #B8924A 100%
          );
          background-size: 300% 100%;
          animation: border-shine-rotate 6s ease-in-out infinite;
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
          top: 80%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          border-radius: 50%;
          background: #7990A5;
          filter: blur(20px);
          opacity: 1;
          z-index: 1;
          pointer-events: none;
          animation: glow-pulse 4s ease-in-out infinite;
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
