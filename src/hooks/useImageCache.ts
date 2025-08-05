import { useEffect, useState } from 'react';

// Global image cache to persist across component unmounts
const imageCache = new Set<string>();
const imagePromises = new Map<string, Promise<void>>();

export const useImageCache = (images: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadImages = async () => {
      const newLoadedImages = new Set(loadedImages);
      
      for (const src of images) {
        // If already cached globally, mark as loaded immediately
        if (imageCache.has(src)) {
          newLoadedImages.add(src);
          continue;
        }

        // If already loading, wait for existing promise
        if (imagePromises.has(src)) {
          await imagePromises.get(src);
          newLoadedImages.add(src);
          continue;
        }

        // Create new loading promise
        const loadPromise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            imageCache.add(src);
            newLoadedImages.add(src);
            imagePromises.delete(src);
            resolve();
          };
          img.onerror = () => {
            imagePromises.delete(src);
            reject(new Error(`Failed to load image: ${src}`));
          };
          img.src = src;
        });

        imagePromises.set(src, loadPromise);
        
        try {
          await loadPromise;
        } catch (error) {
          console.warn('Failed to load image:', src, error);
        }
      }

      setLoadedImages(newLoadedImages);
    };

    loadImages();
  }, [images]);

  return {
    isImageLoaded: (src: string) => imageCache.has(src),
    allImagesLoaded: images.every(src => imageCache.has(src)),
    loadedCount: images.filter(src => imageCache.has(src)).length,
    totalCount: images.length
  };
};