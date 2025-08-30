import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterImageProps {
  src: string;
  alt: string;
  isVisible: boolean;
  className?: string;
  isPreloaded?: boolean;
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
}

export const BeforeAfterImage = ({ 
  src, 
  alt, 
  isVisible, 
  className,
  isPreloaded = false,
  onTransitionStart,
  onTransitionComplete
}: BeforeAfterImageProps) => {
  // Two-layer approach: base image (always mounted) + overlay image (for transitions)
  const [baseImage, setBaseImage] = useState({ 
    src, 
    alt, 
    isLoaded: isPreloaded, // If preloaded, start as loaded
    hasError: false 
  });
  const [overlayImage, setOverlayImage] = useState({ src: '', alt: '', isLoaded: false, hasError: false });
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle base image loading
  const handleBaseImageLoad = useCallback(() => {
    setBaseImage(prev => ({ ...prev, isLoaded: true, hasError: false }));
  }, []);

  const handleBaseImageError = useCallback(() => {
    setBaseImage(prev => ({ ...prev, hasError: true }));
  }, []);

  // Handle overlay image loading
  const handleOverlayImageLoad = useCallback(() => {
    setOverlayImage(prev => ({ ...prev, isLoaded: true, hasError: false }));
  }, []);

  const handleOverlayImageError = useCallback(() => {
    setOverlayImage(prev => ({ ...prev, hasError: true }));
  }, []);

  // Handle image changes
  useEffect(() => {
    if (src === baseImage.src) return;

    onTransitionStart?.();
    setIsTransitioning(true);

    // If image is preloaded, transition immediately
    if (isPreloaded) {
      setOverlayImage({ src, alt, isLoaded: true, hasError: false });
      
      // Start crossfade immediately
      requestAnimationFrame(() => {
        setOverlayOpacity(1);
        
        // Complete transition faster for preloaded images
        setTimeout(() => {
          setBaseImage({ src, alt, isLoaded: true, hasError: false });
          setOverlayOpacity(0);
          setIsTransitioning(false);
          
          requestAnimationFrame(() => {
            onTransitionComplete?.();
          });
        }, 150); // Much faster for preloaded images
      });
      return;
    }

    // Regular loading for non-preloaded images
    setOverlayImage({ src, alt, isLoaded: false, hasError: false });
    
    // Preload the image
    const img = new Image();
    img.onload = () => {
      setOverlayImage(prev => ({ ...prev, isLoaded: true, hasError: false }));
      
      // Start crossfade after image loads
      requestAnimationFrame(() => {
        setOverlayOpacity(1);
        
        // After transition completes, swap images
        setTimeout(() => {
          setBaseImage({ src, alt, isLoaded: true, hasError: false });
          setOverlayOpacity(0);
          setIsTransitioning(false);
          
          requestAnimationFrame(() => {
            onTransitionComplete?.();
          });
        }, 300); // Match transition duration
      });
    };
    
    img.onerror = () => {
      setOverlayImage(prev => ({ ...prev, hasError: true }));
      setIsTransitioning(false);
    };
    
    img.src = src;
  }, [src, alt, baseImage.src, isPreloaded, onTransitionStart, onTransitionComplete]);

  const baseImageStyles = "absolute inset-0 w-full h-full object-cover object-center";
  const overlayImageStyles = "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ease-out";

  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)}>
      {/* Base Image - Always mounted */}
      <img
        src={baseImage.src}
        alt={baseImage.alt}
        className={cn(
          baseImageStyles,
          isVisible && baseImage.isLoaded && !baseImage.hasError ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleBaseImageLoad}
        onError={handleBaseImageError}
        loading="eager"
      />

      {/* Overlay Image - For transitions */}
      {overlayImage.src && (
        <img
          src={overlayImage.src}
          alt={overlayImage.alt}
          className={overlayImageStyles}
          style={{ 
            opacity: overlayImage.isLoaded && !overlayImage.hasError ? overlayOpacity : 0 
          }}
          onLoad={handleOverlayImageLoad}
          onError={handleOverlayImageError}
          loading="eager"
        />
      )}
      
      {/* Loading state */}
      {!baseImage.isLoaded && !baseImage.hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {/* Error state */}
      {baseImage.hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-xs">Failed to load</span>
        </div>
      )}
    </div>
  );
};