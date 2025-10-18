import { useState } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

export const FooterCTAGlass = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-4"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
          animation: 'fade-up 0.6s ease-out 1.4s both',
        }}
      >
        <div className="flex items-center justify-between space-x-2">
          {/* Book a consult button */}
          <button
            onClick={() => navigate(language === 'nl' ? '/nl/boek' : '/en/book')}
            className="gold-gradient-border cta-button-glow flex-1 flex items-center rounded-full transition-all duration-200"
            style={{
              paddingTop: '0.35rem',
              paddingBottom: '0.35rem',
              paddingRight: '0.35rem',
              paddingLeft: '1.25rem',
              background: 'rgba(20, 30, 48, 0.6)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
              justifyContent: 'center',
              gap: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(20, 30, 48, 0.7)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(20, 30, 48, 0.6)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span
              className="text-white"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '15px',
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
                className="silver-gradient-border w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.10)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                }}
              >
                <ArrowUpRight className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </span>
          </button>

          {/* Chat button */}
          <button
            onClick={() => setShowChat(true)}
            className="silver-gradient-border w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.30)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <MessageCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            animation: 'fade-in 0.3s ease-out',
          }}
          onClick={() => setShowChat(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.30)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              animation: 'slide-up 0.3s ease-out',
              marginBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-white text-xl font-semibold"
                style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
              >
                {language === 'nl' ? 'Chat met ons' : 'Chat with us'}
              </h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <p
              className="text-white/80 mb-4"
              style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
            >
              {language === 'nl' 
                ? 'Onze experts staan klaar om je te helpen.' 
                : 'Our experts are ready to help you.'}
            </p>

            <div className="space-y-2">
              <button
                className="w-full py-3 px-4 rounded-2xl text-left transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.10)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  color: 'white',
                  fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                }}
              >
                {language === 'nl' ? 'Ik heb een vraag over prijzen' : 'I have a question about pricing'}
              </button>
              <button
                className="w-full py-3 px-4 rounded-2xl text-left transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.10)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  color: 'white',
                  fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                }}
              >
                {language === 'nl' ? 'Wat is de beste behandeling voor mij?' : 'What is the best treatment for me?'}
              </button>
            </div>
          </div>
        </div>
      )}

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

        .gold-gradient-border {
          position: relative;
        }

        .gold-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(180deg,
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
          background: linear-gradient(180deg,
            #4B555E 0%,
            #ACB9C1 25%,
            #FFFFFF 50%,
            #ACB9C1 75%,
            #4B555E 100%);
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
