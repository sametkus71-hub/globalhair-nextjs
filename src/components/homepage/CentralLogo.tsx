import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
      "w-24 h-24 rounded-2xl",
      "bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm",
      "border border-white/20 shadow-2xl",
      "flex items-center justify-center",
      "transition-all duration-300 hover:scale-105",
      className
    )}>
      <img 
        src="/lovable-uploads/d8eb3cb6-12d3-4e19-8d1a-70fc0bbbecb2.png" 
        alt="GlobalHair Logo" 
        className="w-16 h-16 object-contain"
      />
    </div>
  );
};