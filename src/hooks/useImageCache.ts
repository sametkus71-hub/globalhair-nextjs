import { useEffect, useState } from 'react';

// Global image cache to persist across component unmounts
const imageCache = new Set<string>();
const imagePromises = new Map<string, Promise<void>>();

export const useImageCache = (images: string[]) => {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      // Check if all images are already cached
      if (images.every(src => imageCache.has(src))) {
        setAllImagesLoaded(true);
        return;
      }

      const loadPromises = images.map(async (src) => {
        // If already cached globally, skip
        if (imageCache.has(src)) {
          return;
        }

        // If already loading, wait for existing promise
        if (imagePromises.has(src)) {
          return imagePromises.get(src);
        }

        // Create new loading promise
        const loadPromise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            imageCache.add(src);
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
        return loadPromise;
      });

      try {
        await Promise.all(loadPromises);
        setAllImagesLoaded(true);
      } catch (error) {
        console.warn('Some images failed to load:', error);
        setAllImagesLoaded(true); // Continue even if some images fail
      }
    };

    loadImages();
  }, []); // Only run once when component mounts

  return {
    isImageLoaded: (src: string) => imageCache.has(src),
    allImagesLoaded,
    loadedCount: images.filter(src => imageCache.has(src)).length,
    totalCount: images.length
  };
};