import { cn } from '@/lib/utils';

interface LightningIconProps {
  className?: string;
}

export const LightningIcon = ({ className }: LightningIconProps) => {
  return (
    <div 
      className={cn("w-6 h-6 bg-white rounded-full flex items-center justify-center", className)}
    >
      {/* Placeholder - will be replaced with actual lightning icon */}
      <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
    </div>
  );
};