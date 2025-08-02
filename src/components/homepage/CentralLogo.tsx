import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
      "w-20 h-20 rounded-2xl",
      "bg-gradient-secondary backdrop-blur-sm",
      "border border-white/20 shadow-strong",
      "flex items-center justify-center",
      "transition-all duration-300 hover:scale-105",
      className
    )}>
      <div className="text-2xl font-header font-bold text-primary">
        GH
      </div>
    </div>
  );
};