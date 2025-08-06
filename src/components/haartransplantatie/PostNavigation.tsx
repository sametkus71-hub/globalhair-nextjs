import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface PostNavigationProps {
  currentPost: number;
  totalPosts: number;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  className?: string;
}

export const PostNavigation = ({
  currentPost,
  totalPosts,
  onNext,
  onPrevious,
  canGoNext = false,
  canGoPrevious = false,
  className = ''
}: PostNavigationProps) => {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {/* Progress Dots */}
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPosts }, (_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentPost 
                ? "bg-primary w-6" 
                : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>

      {/* Post Counter */}
      <div className="text-sm text-muted-foreground font-medium">
        {currentPost + 1} / {totalPosts}
      </div>

      {/* Next Button */}
      {canGoNext && onNext && (
        <button
          onClick={onNext}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label="Next post"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}
      
      {/* Spacer when no next button */}
      {!canGoNext && <div className="w-10" />}
    </div>
  );
};