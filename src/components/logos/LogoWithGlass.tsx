import { cn } from '@/lib/utils';
import { GlobalHairLogo } from './GlobalHairLogo';
import { GlassmorphismShield } from './GlassmorphismShield';

interface LogoWithGlassProps {
  className?: string;
}

export const LogoWithGlass = ({ className }: LogoWithGlassProps) => {
  return (
    <div className={cn("relative", className)}>
      {/* Glassmorphism background behind the logo */}
      <GlassmorphismShield />
      
      {/* Original logo on top */}
      <GlobalHairLogo className="relative z-10 w-full h-full" />
    </div>
  );
};