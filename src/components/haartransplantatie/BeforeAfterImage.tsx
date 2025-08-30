import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterImageProps {
  src: string;
  alt: string;
  isVisible: boolean;
  className?: string;
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
}

interface ImageState {
  src: string;
  alt: string;
  isLoaded: boolean;
  hasError: boolean;
}

export const BeforeAfterImage = ({ 
  src, 
  alt, 
  isVisible, 
  className,
  onTransitionStart,
  onTransitionComplete
}: BeforeAfterImageProps) => {
  const [currentImage, setCurrentImage] = useState<ImageState>({
    src,
    alt,
    isLoaded: false,
    hasError: false
  });
  
  const [nextImage, setNextImage] = useState<ImageState | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'fadeOut' | 'pop' | 'fadeIn'>('idle');

  // Preload next image when src changes
  useEffect(() => {
    if (src !== currentImage.src && !isTransitioning) {
      // Start transition
      onTransitionStart?.();
      setIsTransitioning(true);
      setTransitionPhase('fadeOut');
      
      // Preload the new image
      const img = new Image();
      img.onload = () => {
        setNextImage({
          src,
          alt,
          isLoaded: true,
          hasError: false
        });
      };
      img.onerror = () => {
        setNextImage({
          src,
          alt,
          isLoaded: false,
          hasError: true
        });
      };
      img.src = src;
    }
  }, [src, alt, currentImage.src, isTransitioning, onTransitionStart]);

  // Handle transition phases
  useEffect(() => {
    if (!isTransitioning || !nextImage) return;

    const timers: NodeJS.Timeout[] = [];

    if (transitionPhase === 'fadeOut') {
      // Phase 1: Fade out and scale down current image (100ms)
      const timer1 = setTimeout(() => {
        setTransitionPhase('pop');
      }, 100);
      timers.push(timer1);
    } else if (transitionPhase === 'pop') {
      // Phase 2: Quick pop effect - new image scales in (150ms)
      const timer2 = setTimeout(() => {
        setTransitionPhase('fadeIn');
      }, 150);
      timers.push(timer2);
    } else if (transitionPhase === 'fadeIn') {
      // Phase 3: Settle to normal scale and full opacity (100ms)
      const timer3 = setTimeout(() => {
        // Complete transition
        setCurrentImage(nextImage);
        setNextImage(null);
        setIsTransitioning(false);
        setTransitionPhase('idle');
        onTransitionComplete?.();
      }, 100);
      timers.push(timer3);
    }

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [transitionPhase, isTransitioning, nextImage, onTransitionComplete]);

  const handleCurrentImageLoad = useCallback(() => {
    if (!isTransitioning) {
      setCurrentImage(prev => ({ ...prev, isLoaded: true }));
    }
  }, [isTransitioning]);

  const handleCurrentImageError = useCallback(() => {
    if (!isTransitioning) {
      setCurrentImage(prev => ({ ...prev, hasError: true }));
    }
  }, [isTransitioning]);

  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)}>
      {/* Current Image */}
      <img
        src={currentImage.src}
        alt={currentImage.alt}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-100 ease-out",
          // Visibility based on component visibility and loading state
          isVisible && currentImage.isLoaded && !currentImage.hasError ? "opacity-100" : "opacity-0",
          // Scale effects during transition
          !isTransitioning && "scale-100",
          isTransitioning && transitionPhase === 'fadeOut' && "scale-95 opacity-0",
          isTransitioning && (transitionPhase === 'pop' || transitionPhase === 'fadeIn') && "scale-95 opacity-0"
        )}
        onLoad={handleCurrentImageLoad}
        onError={handleCurrentImageError}
        loading="eager"
      />

      {/* Next Image (during transition) */}
      {isTransitioning && nextImage && (
        <img
          src={nextImage.src}
          alt={nextImage.alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-100 ease-out",
            // Only show during pop and fadeIn phases
            transitionPhase === 'fadeOut' && "opacity-0 scale-105",
            transitionPhase === 'pop' && "opacity-90 scale-105",
            transitionPhase === 'fadeIn' && "opacity-100 scale-100",
            nextImage.hasError && "opacity-0"
          )}
          loading="eager"
        />
      )}
      
      {/* Loading state */}
      {!currentImage.isLoaded && !currentImage.hasError && !isTransitioning && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {/* Error state */}
      {currentImage.hasError && !isTransitioning && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-xs">Failed to load</span>
        </div>
      )}
    </div>
  );
};