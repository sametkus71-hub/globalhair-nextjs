import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedHeadHero } from './AnimatedHeadHero';
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';

interface GlassHeaderProps {
  hideButton?: boolean;
}

export const GlassHeader = ({ hideButton = false }: GlassHeaderProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isMobile = useIsMobile();

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
            src={hairtransplantLogo} 
            alt="GHI Hairtransplant Logo" 
            style={{ height: '2.5rem' }}
          />
        </div>
        
        {/* Button - right side (desktop only) */}
        {!isMobile && !hideButton && (
          <div className="flex items-center">
            <AnimatedHeadHero inHeader={true} />
          </div>
        )}
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
