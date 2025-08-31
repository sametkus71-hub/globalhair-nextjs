import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterImageProps {
  src: string;
  alt: string;
  isVisible: boolean;
  className?: string;
  isPreloaded?: boolean;
}

export const BeforeAfterImage = ({ 
  src, 
  alt, 
  isVisible, 
  className,
  isPreloaded = false
}: BeforeAfterImageProps) => {
  const [imageState, setImageState] = useState({ 
    src, 
    alt, 
    isLoaded: isPreloaded, // If preloaded, start as loaded
    hasError: false 
  });

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setImageState(prev => ({ ...prev, isLoaded: true, hasError: false }));
  }, []);

  const handleImageError = useCallback(() => {
    setImageState(prev => ({ ...prev, hasError: true }));
  }, []);

  // Handle image changes instantly
  useEffect(() => {
    if (src === imageState.src) return;

    // Update immediately - no transitions or delays
    setImageState({ src, alt, isLoaded: isPreloaded, hasError: false });
  }, [src, alt, imageState.src, isPreloaded]);

  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)}>
      {/* Main Image - loads immediately */}
      <img
        src={imageState.src}
        alt={imageState.alt}
        className={cn(
          "absolute inset-0 w-full h-full object-cover object-center",
          isVisible && imageState.isLoaded && !imageState.hasError ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager"
      />
      
      {/* Loading state */}
      {!imageState.isLoaded && !imageState.hasError && (
        <div className="absolute inset-0 bg-muted" />
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