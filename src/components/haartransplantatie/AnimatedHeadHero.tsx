import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

export const AnimatedHeadHero = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAnalyzeClick = () => {
    navigate(language === 'nl' ? '/nl/haaranalyse' : '/en/hair-analysis');
  };

  return (
    <div 
      className="relative flex items-end justify-between gap-4"
      style={{
        paddingLeft: 'clamp(0.75rem, 1vw, 1rem)',
        paddingRight: 'clamp(0.75rem, 1vw, 1rem)',
        paddingTop: 'clamp(0.5rem, 1vh, 0.75rem)',
        paddingBottom: 'clamp(0.5rem, 1vh, 1rem)',
        animation: 'fade-up 0.8s ease-out 0.2s both',
      }}
    >
      {/* Primary CTA - Analyze my hair (Left Bottom) */}
      <button
        onClick={handleAnalyzeClick}
        className="silver-gradient-border cursor-pointer group z-10 relative rounded-full flex items-center gap-2 transition-all duration-300"
        style={{
          padding: 'clamp(0.25rem, 0.5vh, 0.4rem) clamp(0.4rem, 0.5vw, 0.6rem) clamp(0.25rem, 0.5vh, 0.4rem) clamp(1.65rem, 1.2vw, 1.4rem)',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          animation: 'fade-up 0.8s ease-out 0.4s both',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        }}
      >
        <span 
          className="text-white whitespace-nowrap"
          style={{ 
            fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
            fontSize: 'clamp(0.75rem, 1.2vh, 0.875rem)',
            fontWeight: '400',
          }}
        >
          {language === 'nl' ? 'Analyseer mijn haar' : 'Analyze my hair'}
        </span>
        <div 
          className="silver-gradient-border cta-button-glow flex items-center justify-center rounded-full"
          style={{
            width: 'clamp(35px, 5vh, 45px)',
            height: 'clamp(35px, 5vh, 45px)',
          }}
        >
          <img src="/assets/camera-icon.svg" alt="Camera" style={{ width: 'clamp(16px, 2vh, 20px)', height: 'clamp(14px, 1.8vh, 16px)' }} />
        </div>
      </button>

      {/* 3D Head Image (Right) */}
      <div 
        className="hero-visual"
        style={{
          animation: 'fade-up 0.8s ease-out 0.3s both',
        }}
      >
        <img
          id="hero-head"
          src="/assets/placeholder-head.png"
          alt="Transparent rotating head"
        />
      </div>

      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        .hero-visual {
          position: relative;
          min-height: 44vh;
        }

        #hero-head {
          position: absolute !important;
          right: 4vw !important;
          top: 2vh !important;
          width: clamp(280px, 78vw, 720px) !important;
          height: auto !important;
          object-fit: contain;
          pointer-events: none;
          z-index: 1;
          filter: saturate(0) brightness(1.35) contrast(1.08) drop-shadow(0 12px 24px rgba(0,0,0,.35));
          opacity: .96;
        }

        .hero-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(70% 70% at 65% 35%, rgba(255,255,255,.35), rgba(255,255,255,0) 60%);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        @media (min-width: 768px) {
          #hero-head {
            right: 6vw !important;
            width: clamp(420px, 52vw, 860px) !important;
          }
        }
      `}</style>
    </div>
  );
};
