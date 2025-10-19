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
      className="relative flex items-start"
      style={{
        paddingLeft: 'clamp(0.75rem, 1vw, 1rem)',
        animation: 'fade-up 0.8s ease-out 0.4s both',
      }}
    >
      {/* Primary CTA - Analyze my hair */}
      <button
        onClick={handleAnalyzeClick}
        className="animated-border-shine cursor-pointer group z-10 relative rounded-full flex items-center gap-2 transition-all duration-300"
        style={{
          padding: 'clamp(0.25rem, 0.5vh, 0.4rem) clamp(0.35rem, 0.4vw, 0.5rem) clamp(0.25rem, 0.5vh, 0.4rem) clamp(1.8rem, 1.4vw, 1.6rem)',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
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
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 'clamp(0.875rem, 1.4vh, 1rem)',
            fontWeight: '300',
            paddingRight: '.75rem',
          }}
        >
          Analyze my hair
        </span>
        <div 
          className="silver-gradient-border cta-button-glow flex items-center justify-center rounded-full"
          style={{
            width: 'clamp(35px, 5vh, 45px)',
            height: 'clamp(35px, 5vh, 45px)',
            marginLeft: 'clamp(0.5rem, 0.7vw, 0.65rem)',
          }}
        >
          <img src="/assets/camera-icon.svg" alt="Camera" style={{ width: 'clamp(18px, 2.3vh, 23px)', height: 'clamp(16px, 2.1vh, 19px)' }} />
        </div>
      </button>

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

        .animated-border-shine {
          position: relative;
        }

        .animated-border-shine::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #7a7a7a 0%,
            #8a8a8a 15%,
            #a5a5a5 30%,
            #d5d5d5 45%,
            #f0f0f0 50%,
            #d5d5d5 55%,
            #a5a5a5 70%,
            #8a8a8a 85%,
            #7a7a7a 100%
          );
          background-size: 300% 100%;
          animation: border-shine-rotate 6s ease-in-out infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .animated-border-shine > * {
          position: relative;
          z-index: 3;
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
      `}</style>
    </div>
  );
};
