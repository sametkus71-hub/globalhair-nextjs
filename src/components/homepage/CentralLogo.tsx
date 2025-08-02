import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
      "w-16 h-16 rounded-lg",
      "bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm",
      "border border-white/15 shadow-xl",
      "flex items-center justify-center",
      "transition-all duration-300 hover:scale-105",
      className
    )}>
      <img 
        src="/lovable-uploads/d8eb3cb6-12d3-4e19-8d1a-70fc0bbbecb2.png" 
        alt="GlobalHair Logo" 
        className="w-10 h-10 object-contain"
      />
    </div>
  );
};