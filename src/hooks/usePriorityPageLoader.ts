import { useState, useEffect } from 'react';
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
  const [loadedPhases, setLoadedPhases] = useState({
    critical: false,
    high: false,
    all: false
  });

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

    let criticalTimer: NodeJS.Timeout;
    let minLoadingTimer: NodeJS.Timeout;
    let criticalDelayPassed = false;
    let minTimePassed = false;

    const checkShowContent = () => {
      if (loadedPhases.high && criticalDelayPassed && minTimePassed) {
        setLoadingStates(prev => ({ ...prev, showContent: true }));
        sessionStorage.setItem('homepage-visited', 'true');
      }
    };

    const checkAllLoaded = () => {
      if (loadedPhases.all) {
        setLoadingStates(prev => ({ ...prev, allLoaded: true }));
      }
    };

    // Critical delay timer (minimum logo show time)
    criticalTimer = setTimeout(() => {
      criticalDelayPassed = true;
      checkShowContent();
    }, criticalDelay);

    // Minimum loading time timer
    minLoadingTimer = setTimeout(() => {
      minTimePassed = true;
      checkShowContent();
    }, minLoadingTime);

    return () => {
      clearTimeout(criticalTimer);
      clearTimeout(minLoadingTimer);
    };
  }, [assets, criticalDelay, minLoadingTime, loadedPhases]);

  const handleCriticalLoaded = () => {
    setLoadedPhases(prev => ({ ...prev, critical: true }));
    setLoadingStates(prev => ({ ...prev, showLogo: true }));
  };

  const handleHighLoaded = () => {
    setLoadedPhases(prev => ({ ...prev, high: true }));
  };

  const handleAllLoaded = () => {
    setLoadedPhases(prev => ({ ...prev, all: true }));
  };

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