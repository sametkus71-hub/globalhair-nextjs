import { cn } from '@/lib/utils';

interface LeafIconProps {
  className?: string;
}

export const LeafIcon = ({ className }: LeafIconProps) => {
  return (
    <div 
      className={cn("w-4 h-4 bg-white rounded-full flex items-center justify-center", className)}
    >
      {/* Placeholder - will be replaced with actual leaf icon */}
      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
    </div>
  );
};