import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import logoHeader from '@/assets/logo-header.png';

export const GlassHeader = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 animate-fade-in"
      style={{
        animation: 'fade-down 0.6s ease-out',
      }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/f090962b-0f2c-4b17-9a77-c7a3d700434f.png" 
            alt="GHI Hairtransplant Logo" 
            className="h-8"
          />
        </div>

        {/* Dashboard button */}
        <button
          onClick={() => navigate(language === 'nl' ? '/nl' : '/en')}
          className="w-8 h-8 flex items-center justify-center transition-opacity duration-200 hover:opacity-70"
        >
          <img 
            src="/assets/dashboard-icon.svg" 
            alt="Dashboard" 
            className="w-5 h-5"
          />
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
