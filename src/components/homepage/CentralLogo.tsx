import { CachedImage } from '@/components/ImagePreloader';
import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
      "flex items-center justify-center",
      className
    )}>
      <CachedImage 
        src="/lovable-uploads/1c0a6d55-db05-4d05-a47b-e6dd814c6d62.png" 
        alt="GlobalHair logo - Premium haartransplantatie en V6 Hairboost specialist" 
        className="w-16 h-16 object-contain"
      />
    </div>
  );
};