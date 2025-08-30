import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterImageProps {
  src: string;
  alt: string;
  isVisible: boolean;
  className?: string;
}

export const BeforeAfterImage = ({ 
  src, 
  alt, 
  isVisible, 
  className 
}: BeforeAfterImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isVisible && isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
          hasError && "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="eager"
      />
      
      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-xs">Failed to load</span>
        </div>
      )}
    </div>
  );
};