import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/hooks/useSession';
import { useLocation } from 'react-router-dom';

export const useBookIconAnimation = () => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'entrance' | 'hold' | 'exit'>('idle');
  const { profile } = useSession();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousProfileRef = useRef<{ selectedPackage: string; locatie: string } | null>(null);
  const lastLocationRef = useRef<string>('');
  const isNavigatingRef = useRef<boolean>(false);

  const triggerGlowAnimation = () => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
    }

    // Start entrance phase
    setAnimationPhase('entrance');
    setIsGlowing(true);

    // Enter hold phase after 200ms
    timeoutRef.current = setTimeout(() => {
      setAnimationPhase('hold');
    }, 200);

    // Enter exit phase after 500ms (200ms entrance + 300ms hold)
    exitTimeoutRef.current = setTimeout(() => {
      setAnimationPhase('exit');
      // End animation after total 700ms
      setTimeout(() => {
        setIsGlowing(false);
        setAnimationPhase('idle');
      }, 200);
    }, 500);
  };

  // Track navigation changes to prevent false animation triggers
  useEffect(() => {
    if (lastLocationRef.current !== location.pathname) {
      isNavigatingRef.current = true;
      lastLocationRef.current = location.pathname;
      
      // Reset navigation flag after a short delay
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 300);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Skip animation on first load
    if (!previousProfileRef.current) {
      previousProfileRef.current = {
        selectedPackage: profile.selectedPackage,
        locatie: profile.locatie
      };
      return;
    }

    // Use deep value comparison to prevent false triggers from reference changes
    const currentValues = {
      selectedPackage: profile.selectedPackage,
      locatie: profile.locatie
    };

    const previousValues = previousProfileRef.current;
    
    // Check if values actually changed (not just reference)
    const hasActuallyChanged = 
      JSON.stringify(previousValues) !== JSON.stringify(currentValues);

    if (hasActuallyChanged) {
      console.log('Profile change detected:', { previousValues, currentValues, isNavigating: isNavigatingRef.current });
      
      // Clear any existing debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Only skip animation during navigation, but allow same-page changes
      if (isNavigatingRef.current) {
        console.log('Skipping animation due to navigation');
        // Update previous values even if we skip animation
        previousProfileRef.current = currentValues;
        return;
      }

      // Reduced debounce for faster response to user interactions
      debounceTimeoutRef.current = setTimeout(() => {
        console.log('Triggering glow animation');
        triggerGlowAnimation();
      }, 50);
    }

    // Update previous values
    previousProfileRef.current = currentValues;
  }, [profile.selectedPackage, profile.locatie]);

  // Listen for storage events (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProfile' && e.newValue && !isNavigatingRef.current) {
        try {
          const newProfile = JSON.parse(e.newValue);
          const currentValues = {
            selectedPackage: newProfile.selectedPackage,
            locatie: newProfile.locatie
          };
          
          // Use deep comparison for storage events too
          const hasActuallyChanged = 
            previousProfileRef.current && 
            JSON.stringify(previousProfileRef.current) !== JSON.stringify(currentValues);

          if (hasActuallyChanged) {
            // Debounce storage events as well
            if (debounceTimeoutRef.current) {
              clearTimeout(debounceTimeoutRef.current);
            }

            debounceTimeoutRef.current = setTimeout(() => {
              if (!isNavigatingRef.current) {
                triggerGlowAnimation();
                previousProfileRef.current = currentValues;
              }
            }, 100);
          }
        } catch (error) {
          console.error('Error parsing profile from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return { isGlowing, animationPhase };
};