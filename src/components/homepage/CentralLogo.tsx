import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
      "w-24 h-24",
      "bg-gradient-to-br from-amber-400/90 via-yellow-500/95 to-amber-600/90",
      "backdrop-blur-md shadow-2xl",
      "flex items-center justify-center",
      "transition-all duration-300 hover:scale-105 hover:shadow-amber-500/30",
      "border-2 border-amber-300/40",
      className
    )}
    style={{ 
      borderRadius: '50%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 0 2px rgba(251,191,36,0.2)',
    }}
    >
      <img 
        src="/lovable-uploads/d8eb3cb6-12d3-4e19-8d1a-70fc0bbbecb2.png" 
        alt="GlobalHair Logo" 
        className="w-14 h-14 object-contain drop-shadow-lg"
      />
    </div>
  );
};