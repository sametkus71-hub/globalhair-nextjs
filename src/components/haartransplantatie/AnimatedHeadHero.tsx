import { Camera, Upload } from 'lucide-react';
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
      className="relative flex items-end justify-between px-4 pt-3 pb-4 gap-4"
      style={{
        animation: 'fade-up 0.8s ease-out 0.2s both',
      }}
    >
      {/* Primary CTA - Analyze my hair (Left Bottom) */}
      <button
        onClick={handleAnalyzeClick}
        className="silver-gradient-border cursor-pointer group z-10 relative pl-4 pr-2 py-2 rounded-full flex items-center gap-2 transition-all duration-300"
        style={{
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
          className="text-white font-semibold text-sm whitespace-nowrap"
          style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
        >
          {language === 'nl' ? 'Analyseer mijn haar' : 'Analyze my hair'}
        </span>
        <div 
          className="silver-gradient-border flex items-center justify-center rounded-full"
          style={{
            width: '48px',
            height: '48px',
            background: 'rgba(255, 255, 255, 0.15)',
          }}
        >
          <Camera className="w-6 h-6 text-white" />
        </div>
      </button>

      {/* 3D Head Image (Right) */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: '400px',
          animation: 'fade-up 0.8s ease-out 0.3s both',
        }}
      >
        <img
          src="/assets/placeholder-head.png"
          alt="3D head model"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(99, 179, 237, 0.4))',
          }}
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
      `}</style>
    </div>
  );
};
