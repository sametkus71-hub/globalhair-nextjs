import { CachedImage } from '@/components/ImagePreloader';
import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]",
      "flex items-center justify-center pointer-events-none",
      className
    )}>
      <CachedImage 
        src="/lovable-uploads/230b8ef0-b4c0-4aee-af54-df5e7f2a6201.png" 
        alt="GlobalHair logo - Premium haartransplantatie en V6 Hairboost specialist" 
        className="w-20 h-20 object-contain"
      />
    </div>
  );
};