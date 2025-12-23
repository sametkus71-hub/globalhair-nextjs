
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedHeadHero } from './AnimatedHeadHero';
import v6Logo from '@/assets/logo-v6-hairboost.png';

interface GlassHeaderProps {
  hideButton?: boolean;
}

export const GlassHeaderV6 = ({ hideButton = false }: GlassHeaderProps) => {
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
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <img 
            src={v6Logo} 
            alt="V6 Hairboost Logo" 
            style={{ height: '3.5rem', width: 'auto', cursor: 'pointer' }}
            onClick={() => navigate(language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant')}
          />
          <span 
            className="text-[1.3rem] font-normal text-white tracking-wide cursor-pointer flex items-start leading-none translate-y-[2px]"
            onClick={() => navigate(language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant')}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Hairboost
            <span className="text-xs ml-0.5 -mt-1">®</span>
          </span>
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
