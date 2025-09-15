import { cn } from '@/lib/utils';

interface PenIconProps {
  className?: string;
}

export const PenIcon = ({ className }: PenIconProps) => {
  return (
    <div 
      className={cn("w-6 h-6 bg-white rounded-full flex items-center justify-center", className)}
    >
      {/* Placeholder - will be replaced with actual pen icon */}
      <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
    </div>
  );
};