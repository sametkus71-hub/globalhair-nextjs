import { cn } from '@/lib/utils';

interface PlayButtonIconProps {
  className?: string;
}

export const PlayButtonIcon = ({ className }: PlayButtonIconProps) => {
  return (
    <div 
      className={cn("w-4 h-4 bg-white rounded-full flex items-center justify-center", className)}
    >
      {/* Placeholder - will be replaced with actual play button icon */}
      <div className="w-0 h-0 border-l-2 border-l-blue-400 border-t border-t-transparent border-b border-b-transparent"></div>
    </div>
  );
};