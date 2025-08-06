import { useState, useEffect, useCallback, useRef } from 'react';
import { PriorityAsset } from '@/components/PriorityImageLoader';

interface UsePriorityPageLoaderOptions {
  assets?: PriorityAsset[];
  criticalDelay?: number; // Minimum time to show logo before revealing content
  minLoadingTime?: number; // Minimum total loading time
}

export const usePriorityPageLoader = ({ 
  assets = [],
  criticalDelay = 300, // Logo shows for at least 300ms
  minLoadingTime = 800 
}: UsePriorityPageLoaderOptions = {}) => {
  const [loadingStates, setLoadingStates] = useState({
    showLogo: false,
    showContent: false,
    allLoaded: false
  });
  
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const loadedPhases = useRef({
    critical: false,
    high: false,
    all: false
  });

  const timers = useRef<{
    criticalTimer?: NodeJS.Timeout;
    minLoadingTimer?: NodeJS.Timeout;
  }>({});

  const criticalDelayPassed = useRef(false);
  const minTimePassed = useRef(false);

  const checkShowContent = useCallback(() => {
    if (loadedPhases.current.high && criticalDelayPassed.current && minTimePassed.current) {
      setLoadingStates(prev => ({ ...prev, showContent: true }));
      sessionStorage.setItem('homepage-visited', 'true');
    }
  }, []);

  const checkAllLoaded = useCallback(() => {
    if (loadedPhases.current.all) {
      setLoadingStates(prev => ({ ...prev, allLoaded: true }));
    }
  }, []);

  useEffect(() => {
    // Check if this is the first load
    const hasVisited = sessionStorage.getItem('homepage-visited');
    const firstLoad = !hasVisited;
    setIsFirstLoad(firstLoad);

    if (!firstLoad) {
      // Not first load, show everything immediately
      setLoadingStates({
        showLogo: true,
        showContent: true,
        allLoaded: true
      });
      return;
    }

    // Reset refs for first load
    criticalDelayPassed.current = false;
    minTimePassed.current = false;
    loadedPhases.current = { critical: false, high: false, all: false };

    // Critical delay timer (minimum logo show time)
    timers.current.criticalTimer = setTimeout(() => {
      criticalDelayPassed.current = true;
      checkShowContent();
    }, criticalDelay);

    // Minimum loading time timer
    timers.current.minLoadingTimer = setTimeout(() => {
      minTimePassed.current = true;
      checkShowContent();
    }, minLoadingTime);

    return () => {
      if (timers.current.criticalTimer) {
        clearTimeout(timers.current.criticalTimer);
      }
      if (timers.current.minLoadingTimer) {
        clearTimeout(timers.current.minLoadingTimer);
      }
    };
  }, []); // Only run once on mount

  const handleCriticalLoaded = useCallback(() => {
    loadedPhases.current.critical = true;
    setLoadingStates(prev => ({ ...prev, showLogo: true }));
  }, []);

  const handleHighLoaded = useCallback(() => {
    loadedPhases.current.high = true;
    checkShowContent();
  }, [checkShowContent]);

  const handleAllLoaded = useCallback(() => {
    loadedPhases.current.all = true;
    checkAllLoaded();
  }, [checkAllLoaded]);

  return {
    isFirstLoad,
    showLogo: loadingStates.showLogo,
    showContent: loadingStates.showContent,
    allLoaded: loadingStates.allLoaded,
    onCriticalLoaded: handleCriticalLoaded,
    onHighLoaded: handleHighLoaded,
    onAllLoaded: handleAllLoaded
  };
};