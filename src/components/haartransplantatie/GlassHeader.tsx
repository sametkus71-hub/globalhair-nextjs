import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Grid3x3 } from 'lucide-react';

export const GlassHeader = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 animate-fade-in"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        animation: 'fade-down 0.6s ease-out',
      }}
    >
      <div className="flex items-center justify-between px-3 py-2">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img 
            src="/assets/logo-shield.png" 
            alt="GHI Logo" 
            className="w-7 h-7"
          />
          <span 
            className="text-white font-semibold text-sm"
            style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
          >
            GHI Hairtransplant
          </span>
        </div>

        {/* Dashboard button */}
        <button
          onClick={() => navigate(language === 'nl' ? '/nl' : '/en')}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          }}
        >
          <Grid3x3 className="w-4 h-4 text-white" strokeWidth={1.5} />
        </button>
      </div>

      <style>{`
        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};
