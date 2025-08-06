import { useState, useEffect, useCallback } from 'react';

interface UsePriorityPageLoaderOptions {
  criticalDelay?: number;
  minLoadingTime?: number;
}

export const usePriorityPageLoader = ({ 
  criticalDelay = 300,
  minLoadingTime = 800 
}: UsePriorityPageLoaderOptions = {}) => {
  const [loadingStates, setLoadingStates] = useState({
    showLogo: false,
    showContent: false,
    allLoaded: false
  });
  
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [phases, setPhases] = useState({
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

    // Reset for first load
    let criticalDelayPassed = false;
    let minTimePassed = false;

    const checkShowContent = () => {
      if (phases.high && criticalDelayPassed && minTimePassed) {
        setLoadingStates(prev => ({ ...prev, showContent: true }));
        sessionStorage.setItem('homepage-visited', 'true');
      }
    };

    // Critical delay timer
    const criticalTimer = setTimeout(() => {
      criticalDelayPassed = true;
      checkShowContent();
    }, criticalDelay);

    // Minimum loading time timer
    const minLoadingTimer = setTimeout(() => {
      minTimePassed = true;
      checkShowContent();
    }, minLoadingTime);

    return () => {
      clearTimeout(criticalTimer);
      clearTimeout(minLoadingTimer);
    };
  }, [criticalDelay, minLoadingTime]); // Removed phases dependency to prevent loops

  // Separate effect for checking content when phases change
  useEffect(() => {
    if (!isFirstLoad) return;
    
    const hasVisited = sessionStorage.getItem('homepage-visited');
    if (hasVisited) return;

    // Simple timeout approach to avoid complexity
    if (phases.high) {
      const timer = setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, showContent: true }));
        sessionStorage.setItem('homepage-visited', 'true');
      }, Math.max(criticalDelay, 100));

      return () => clearTimeout(timer);
    }
  }, [phases.high, isFirstLoad, criticalDelay]);

  const handleCriticalLoaded = useCallback(() => {
    setPhases(prev => ({ ...prev, critical: true }));
    setLoadingStates(prev => ({ ...prev, showLogo: true }));
  }, []);

  const handleHighLoaded = useCallback(() => {
    setPhases(prev => ({ ...prev, high: true }));
  }, []);

  const handleAllLoaded = useCallback(() => {
    setPhases(prev => ({ ...prev, all: true }));
    setLoadingStates(prev => ({ ...prev, allLoaded: true }));
  }, []);

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