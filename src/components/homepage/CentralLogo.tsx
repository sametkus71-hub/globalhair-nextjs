import { GlobalHairLogo } from '@/components/logos/GlobalHairLogo';
import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      className
    )}>
      <GlobalHairLogo />
    </div>
  );
};