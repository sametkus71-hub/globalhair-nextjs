'use client';

import { useState, useEffect } from 'react';

interface UsePageLoaderOptions {
  preloadDuration?: number;
  images?: string[];
  maxWaitMs?: number;
  persistAcrossSessions?: boolean;
  storageKey?: string;
  debug?: boolean;
}

export const usePageLoader = ({ 
  preloadDuration = 1200, // Minimum time to show loader (ms)
  images = [],
  maxWaitMs = 3000, // Safety cap to never get stuck (ms)
  persistAcrossSessions = true, // Remember first-load across browser restarts
  storageKey = 'homepage-visited',
  debug = false
}: UsePageLoaderOptions = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const storage = persistAcrossSessions ? window.localStorage : window.sessionStorage;

    // Check if this is the first load
    const hasVisited = storage.getItem(storageKey);
    const firstLoad = !hasVisited;
    setIsFirstLoad(firstLoad);

    if (!firstLoad) {
      // Not first load, show immediately
      setIsLoading(false);
      return;
    }

    let finished = false;
    let imagesLoaded = images.length === 0; // true if no images to preload
    let minimumTimeElapsed = false;

    const finalize = (reason: string) => {
      if (finished) return;
      finished = true;
      if (debug) console.info('[usePageLoader] Finalizing loader. Reason =', reason);
      setIsLoading(false);
      try { storage.setItem(storageKey, 'true'); } catch {}
    };

    const checkComplete = () => {
      if (imagesLoaded && minimumTimeElapsed) {
        finalize('imagesLoaded+minimumTimeElapsed');
      }
    };

    // Preload images with cache-awareness
    if (images.length > 0) {
      let loadedCount = 0;
      const totalImages = images.length;

      const onOneDone = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          imagesLoaded = true;
          checkComplete();
        }
      };

      images.forEach((src) => {
        try {
          const img = new Image();
          img.onload = onOneDone;
          img.onerror = onOneDone;
          img.src = src; // set src first so .complete is meaningful
          if (img.complete) {
            // Already cached by the browser
            onOneDone();
          }
        } catch {
          onOneDone();
        }
      });
    }

    // Minimum preload duration
    const minTimer = setTimeout(() => {
      minimumTimeElapsed = true;
      checkComplete();
    }, preloadDuration);

    // Absolute max wait to avoid being stuck on throttled timers/background restores
    const maxTimer = setTimeout(() => {
      finalize('maxWaitMsReached');
    }, Math.max(maxWaitMs, preloadDuration));

    // Handle BFCache/tab restore cases (Safari/Firefox)
    const onPageShow = (e: Event) => {
      const ev = e as any;
      if (ev && ev.persisted) {
        finalize('pageshow(persisted)');
      }
    };

    // If tab becomes visible and we are still loading, attempt to finish soon
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Give a tiny delay to allow any pending image events to flush
        setTimeout(() => checkComplete(), 50);
      }
    };

    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibility);

    if (debug) console.info('[usePageLoader] First load detected. Preloading', images.length, 'images.');

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [preloadDuration, images, maxWaitMs, persistAcrossSessions, storageKey, debug]);

  return { isLoading, isFirstLoad };
};