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
        className="cursor-pointer group z-10 relative pl-4 pr-2 py-2 rounded-full flex items-center gap-2 transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '9999px',
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
          className="flex items-center justify-center rounded-full"
          style={{
            width: '48px',
            height: '48px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
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
      `}</style>
    </div>
  );
};
