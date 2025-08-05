import { useEffect, useState } from 'react';

// Global cache for images with browser-level caching
const globalImageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();

export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  // Return cached image if already loaded
  if (globalImageCache.has(src)) {
    return Promise.resolve(globalImageCache.get(src)!);
  }

  // Return existing loading promise if already loading
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }

  // Create new loading promise
  const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    
    // Set cache headers for better browser caching
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Store in global cache
      globalImageCache.set(src, img);
      loadingPromises.delete(src);
      resolve(img);
    };

    img.onerror = () => {
      loadingPromises.delete(src);
      reject(new Error(`Failed to load image: ${src}`));
    };

    // Start loading
    img.src = src;
  });

  loadingPromises.set(src, loadPromise);
  return loadPromise;
};

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export const CachedImage = ({ src, alt, className, style, onLoad, onError }: CachedImageProps) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    globalImageCache.get(src) || null
  );
  const [isLoading, setIsLoading] = useState(!globalImageCache.has(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (globalImageCache.has(src)) {
      setImageElement(globalImageCache.get(src)!);
      setIsLoading(false);
      onLoad?.();
      return;
    }

    preloadImage(src)
      .then((img) => {
        setImageElement(img);
        setIsLoading(false);
        onLoad?.();
      })
      .catch(() => {
        setIsLoading(false);
        setHasError(true);
        onError?.();
      });
  }, [src, onLoad, onError]);

  if (hasError) {
    return <div className={className} style={style}>Failed to load image</div>;
  }

  if (isLoading || !imageElement) {
    return (
      <div 
        className={`${className} bg-gray-200 animate-pulse`} 
        style={style}
      />
    );
  }

  return (
    <img 
      src={imageElement.src}
      alt={alt}
      className={className}
      style={style}
    />
  );
};

interface ImagePreloaderProps {
  images: string[];
  onComplete?: () => void;
}

export const ImagePreloader = ({ images, onComplete }: ImagePreloaderProps) => {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const preloadAll = async () => {
      try {
        await Promise.allSettled(images.map(preloadImage));
        setLoadedCount(images.length);
        onComplete?.();
      } catch (error) {
        console.warn('Some images failed to preload:', error);
        onComplete?.();
      }
    };

    preloadAll();
  }, [images, onComplete]);

  return null; // This component doesn't render anything
};

// Utility to check if image is cached
export const isImageCached = (src: string): boolean => {
  return globalImageCache.has(src);
};

// Utility to get cache status
export const getCacheStatus = (images: string[]) => {
  const cached = images.filter(isImageCached);
  return {
    cachedCount: cached.length,
    totalCount: images.length,
    allCached: cached.length === images.length,
    cachedImages: cached
  };
};