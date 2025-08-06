import { CentralLogo } from '@/components/homepage/CentralLogo';
import { useScrollFade } from '@/hooks/useScrollFade';

export const ScrollFadeLogo = () => {
  const { opacity } = useScrollFade({ threshold: 100 });

  return (
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none transition-opacity duration-300 ease-out"
      style={{ opacity }}
    >
      <div className="pointer-events-auto">
        <CentralLogo />
      </div>
    </div>
  );
};