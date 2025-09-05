import { GlobalHairLogo } from '@/components/logos/GlobalHairLogo';
import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
  size?: 'default' | 'large';
}

export const CentralLogo = ({ className, size = 'default' }: CentralLogoProps) => {
  const logoSize = size === 'large' ? 'w-32 h-32' : 'w-20 h-20';
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      className
    )}>
      <GlobalHairLogo className={logoSize} />
    </div>
  );
};