import { CentralLogo } from '@/components/homepage/CentralLogo';
import { cn } from '@/lib/utils';

interface TransitionLogoProps {
  isScalingUp: boolean;
  isFadingOut: boolean;
  className?: string;
}

export const TransitionLogo = ({ isScalingUp, isFadingOut, className }: TransitionLogoProps) => {
  if (!isScalingUp && !isFadingOut) {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] pointer-events-none",
        isScalingUp && "logo-scale-up",
        isFadingOut && "logo-fade-out",
        className
      )}
    >
      <CentralLogo />
    </div>
  );
};