import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterImageProps {
  src: string;
  alt: string;
  isVisible: boolean;
  className?: string;
  isPreloaded?: boolean;
}

export const BeforeAfterImage2 = ({ 
  src, 
  alt, 
  isVisible, 
  className,
  isPreloaded = false
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

  // Handle image changes with optimized transitions
  useEffect(() => {
    if (src === baseImage.src) return;

    setIsTransitioning(true);

    // If image is preloaded, transition immediately with smooth animation
    if (isPreloaded) {
      setOverlayImage({ src, alt, isLoaded: true, hasError: false });
      
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        setOverlayOpacity(1);
        
        // Ultra-smooth transition for premium feel
        setTimeout(() => {
          setBaseImage({ src, alt, isLoaded: true, hasError: false });
          setOverlayOpacity(0);
          setIsTransitioning(false);
        }, 200); // Faster but still smooth
      });
      return;
    }

    // For non-preloaded images, still maintain smooth experience
    setOverlayImage({ src, alt, isLoaded: false, hasError: false });
    
    const img = new Image();
    img.onload = () => {
      setOverlayImage(prev => ({ ...prev, isLoaded: true, hasError: false }));
      
      requestAnimationFrame(() => {
        setOverlayOpacity(1);
        
        setTimeout(() => {
          setBaseImage({ src, alt, isLoaded: true, hasError: false });
          setOverlayOpacity(0);
          setIsTransitioning(false);
        }, 250); // Balanced speed and smoothness
      });
    };
    
    img.onerror = () => {
      setOverlayImage(prev => ({ ...prev, hasError: true }));
      setIsTransitioning(false);
    };
    
    img.src = src;
  }, [src, alt, baseImage.src, isPreloaded]);

  const baseImageStyles = "absolute inset-0 w-full h-full object-cover object-center transform-gpu";
  const overlayImageStyles = "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu";

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