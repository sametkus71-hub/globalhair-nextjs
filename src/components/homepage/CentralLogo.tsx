import { CachedImage } from '@/components/ImagePreloader';
import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      "bg-white/10 border border-white/20 rounded-full p-2",
      className
    )}>
      <CachedImage 
        src="/lovable-uploads/230b8ef0-b4c0-4aee-af54-df5e7f2a6201.png" 
        alt="GlobalHair logo - Premium haartransplantatie en V6 Hairboost specialist" 
        className="w-24 h-24 object-contain filter brightness-110"
      />
    </div>
  );
};