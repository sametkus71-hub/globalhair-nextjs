import { useEffect, useState, useRef } from 'react';

// Global image cache to persist across component unmounts
const imageCache = new Set<string>();
const imagePromises = new Map<string, Promise<void>>();
const preloadedImages = new Map<string, HTMLImageElement>();

// Aggressive preloading function
const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // Return cached image immediately
    if (preloadedImages.has(src)) {
      resolve(preloadedImages.get(src)!);
      return;
    }

    // If already loading, wait for existing promise
    if (imagePromises.has(src)) {
      imagePromises.get(src)?.then(() => {
        resolve(preloadedImages.get(src)!);
      }).catch(reject);
      return;
    }

    const img = new Image();
    const loadPromise = new Promise<void>((resolveLoad, rejectLoad) => {
      img.onload = () => {
        imageCache.add(src);
        preloadedImages.set(src, img);
        imagePromises.delete(src);
        resolveLoad();
      };
      img.onerror = () => {
        imagePromises.delete(src);
        rejectLoad(new Error(`Failed to load image: ${src}`));
      };
    });

    imagePromises.set(src, loadPromise);
    
    // Set high priority for faster loading
    img.fetchPriority = 'high' as any;
    img.loading = 'eager';
    img.src = src;
    
    loadPromise.then(() => resolve(img)).catch(reject);
  });
};

export const useImageCache = (images: string[]) => {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      // Check if all images are already cached
      const cachedCount = images.filter(src => imageCache.has(src)).length;
      
      if (cachedCount === images.length) {
        if (mountedRef.current) {
          setLoadedCount(cachedCount);
          setAllImagesLoaded(true);
        }
        return;
      }

      // Start aggressive preloading
      const loadPromises = images.map(src => preloadImage(src));

      try {
        let completedCount = cachedCount;
        
        // Update progress as each image loads
        const progressPromises = loadPromises.map(async (promise, index) => {
          try {
            await promise;
            completedCount++;
            if (mountedRef.current) {
              setLoadedCount(completedCount);
            }
          } catch (error) {
            // Continue loading other images even if one fails
            completedCount++;
            if (mountedRef.current) {
              setLoadedCount(completedCount);
            }
          }
        });

        await Promise.allSettled(progressPromises);
        
        if (mountedRef.current) {
          setAllImagesLoaded(true);
        }
      } catch (error) {
        // Even if some images fail, mark as complete to avoid blocking
        if (mountedRef.current) {
          setAllImagesLoaded(true);
        }
      }
    };

    loadImages();
  }, [images]);

  return {
    isImageLoaded: (src: string) => imageCache.has(src),
    allImagesLoaded,
    loadedCount,
    totalCount: images.length,
    loadProgress: images.length > 0 ? loadedCount / images.length : 0
  };
};