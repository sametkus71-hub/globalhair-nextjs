import { useState, useEffect } from 'react';

interface UsePageLoaderOptions {
  preloadDuration?: number;
  images?: string[];
}

export const usePageLoader = ({ 
  preloadDuration = 600, 
  images = []
}: UsePageLoaderOptions = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if this is the first load
    const hasVisited = sessionStorage.getItem('homepage-visited');
    const firstLoad = !hasVisited;
    setIsFirstLoad(firstLoad);

    if (!firstLoad) {
      // Not first load, show immediately
      setIsLoading(false);
      return;
    }

    // First load - preload images and wait for minimum duration
    let imagesLoaded = false;
    let minimumTimeElapsed = false;

    const checkComplete = () => {
      if (imagesLoaded && minimumTimeElapsed) {
        setIsLoading(false);
        sessionStorage.setItem('homepage-visited', 'true');
      }
    };

    // Preload images
    if (images.length > 0) {
      let loadedCount = 0;
      const totalImages = images.length;

      images.forEach((src) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            imagesLoaded = true;
            checkComplete();
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            imagesLoaded = true;
            checkComplete();
          }
        };
        img.src = src;
      });
    } else {
      imagesLoaded = true;
    }

    // Minimum preload duration
    const timer = setTimeout(() => {
      minimumTimeElapsed = true;
      checkComplete();
    }, preloadDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [preloadDuration, images]);

  return { isLoading, isFirstLoad };
};