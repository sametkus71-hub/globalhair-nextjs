import { useState, useEffect } from 'react';

interface UseImagePreloaderProps {
  images: string[];
  onAllLoaded?: () => void;
}

export const useImagePreloader = ({ images, onAllLoaded }: UseImagePreloaderProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    if (images.length === 0) {
      setAllImagesLoaded(true);
      onAllLoaded?.();
      return;
    }

    const imagePromises = images.map((src) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = () => reject(src);
        img.src = src;
      });
    });

    Promise.allSettled(imagePromises).then(() => {
      setAllImagesLoaded(true);
      onAllLoaded?.();
    });
  }, [images, onAllLoaded]);

  return {
    loadedImages,
    allImagesLoaded,
    loadedCount: loadedImages.size,
    totalCount: images.length,
    loadingProgress: images.length > 0 ? (loadedImages.size / images.length) * 100 : 100
  };
};