import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface StaticGridImageProps {
  src: string;
  alt: string;
  animationDelay?: number;
  className?: string;
}

export const StaticGridImage = ({ 
  src, 
  alt, 
  animationDelay = 0,
  className
}: StaticGridImageProps) => {
  const [imageState, setImageState] = useState({ 
    isLoaded: false,
    hasError: false,
    shouldAnimate: false
  });

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setImageState(prev => ({ ...prev, isLoaded: true, hasError: false }));
  }, []);

  const handleImageError = useCallback(() => {
    setImageState(prev => ({ ...prev, hasError: true }));
  }, []);

  // Trigger animation after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageState(prev => ({ ...prev, shouldAnimate: true }));
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)}>
      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 w-full h-full object-cover object-center transition-all duration-500",
          imageState.shouldAnimate && imageState.isLoaded && !imageState.hasError 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager"
      />
      
      {/* Loading placeholder */}
      {!imageState.isLoaded && !imageState.hasError && (
        <div className="absolute inset-0 bg-muted/50" />
      )}
      
      {/* Error state */}
      {imageState.hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-xs">Failed to load</span>
        </div>
      )}
    </div>
  );
};