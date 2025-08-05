import { CachedImage } from '@/components/ImagePreloader';
import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 z-10",
      "w-24 h-24",
      "flex items-center justify-center",
      "transition-all duration-300 hover:scale-105",
      className
    )}
    style={{ 
      borderRadius: '16px',
      background: 'linear-gradient(145deg, #1E3340, #16232B, #0F1A21)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset',
      // Footer compensation: move up by half the footer height
      transform: 'translateX(-50%) translateY(calc(-50% - 30px))'
    }}
    >
      <CachedImage 
        src="/assets/logo-shield.png" 
        alt="GlobalHair Shield Logo" 
        className="w-20 h-20 object-contain"
      />
    </div>
  );
};