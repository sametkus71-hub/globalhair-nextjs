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
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'fadeOut' | 'pop' | 'fadeIn' | 'overlap'>('idle');

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

  // Handle transition phases with anti-flicker improvements
  useEffect(() => {
    if (!isTransitioning || !nextImage) return;

    const timers: NodeJS.Timeout[] = [];

    if (transitionPhase === 'fadeOut') {
      // Phase 1: Fade out current image (100ms)
      const timer1 = setTimeout(() => {
        setTransitionPhase('pop');
      }, 100);
      timers.push(timer1);
    } else if (transitionPhase === 'pop') {
      // Phase 2: Pop effect - new image scales in (150ms)
      const timer2 = setTimeout(() => {
        setTransitionPhase('fadeIn');
      }, 150);
      timers.push(timer2);
    } else if (transitionPhase === 'fadeIn') {
      // Phase 3: Settle and create overlap (100ms)
      const timer3 = setTimeout(() => {
        setTransitionPhase('overlap');
      }, 100);
      timers.push(timer3);
    } else if (transitionPhase === 'overlap') {
      // Phase 4: Brief overlap to prevent flicker, then complete (16ms - one frame)
      const timer4 = setTimeout(() => {
        // Use functional update to prevent race conditions
        setCurrentImage(prevCurrent => nextImage);
        setNextImage(null);
        setIsTransitioning(false);
        setTransitionPhase('idle');
        // Delay callback to ensure state is fully updated
        requestAnimationFrame(() => {
          onTransitionComplete?.();
        });
      }, 16);
      timers.push(timer4);
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

  // Base styles for GPU acceleration and layout stability
  const baseImageStyles = "absolute inset-0 w-full h-full object-cover object-center transition-all duration-100 ease-out will-change-transform backface-hidden";
  
  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)} style={{ imageRendering: 'auto' }}>
      {/* Current Image - with improved visibility logic */}
      <img
        src={currentImage.src}
        alt={currentImage.alt}
        className={cn(
          baseImageStyles,
          // Base visibility
          isVisible && currentImage.isLoaded && !currentImage.hasError ? "opacity-100" : "opacity-0",
          // Transition states - keep visible longer to prevent gaps
          !isTransitioning && "scale-100",
          isTransitioning && transitionPhase === 'fadeOut' && "scale-95 opacity-20", // Reduced opacity instead of 0
          isTransitioning && transitionPhase === 'pop' && "scale-95 opacity-10", // Minimal but visible
          isTransitioning && transitionPhase === 'fadeIn' && "scale-95 opacity-5", // Nearly invisible but present
          isTransitioning && transitionPhase === 'overlap' && "scale-100 opacity-100" // Fully visible during overlap
        )}
        style={{ 
          zIndex: isTransitioning && (transitionPhase === 'pop' || transitionPhase === 'fadeIn') ? 1 : 2,
          transform: 'translate3d(0, 0, 0)' // Force GPU layer
        }}
        onLoad={handleCurrentImageLoad}
        onError={handleCurrentImageError}
        loading="eager"
      />

      {/* Next Image (during transition) - with improved z-index management */}
      {isTransitioning && nextImage && nextImage.isLoaded && (
        <img
          src={nextImage.src}
          alt={nextImage.alt}
          className={cn(
            baseImageStyles,
            // Transition phases with smoother visibility
            transitionPhase === 'fadeOut' && "opacity-0 scale-105",
            transitionPhase === 'pop' && "opacity-90 scale-105",
            transitionPhase === 'fadeIn' && "opacity-100 scale-100",
            transitionPhase === 'overlap' && "opacity-100 scale-100",
            nextImage.hasError && "opacity-0"
          )}
          style={{ 
            zIndex: transitionPhase === 'overlap' ? 1 : 3, // Lower during overlap
            transform: 'translate3d(0, 0, 0)' // Force GPU layer
          }}
          loading="eager"
        />
      )}
      
      {/* Loading state - only show when not transitioning */}
      {!currentImage.isLoaded && !currentImage.hasError && !isTransitioning && (
        <div className="absolute inset-0 bg-muted animate-pulse" style={{ zIndex: 0 }} />
      )}
      
      {/* Error state - only show when not transitioning */}
      {currentImage.hasError && !isTransitioning && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center" style={{ zIndex: 0 }}>
          <span className="text-muted-foreground text-xs">Failed to load</span>
        </div>
      )}
    </div>
  );
};