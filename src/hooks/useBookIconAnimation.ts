import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/hooks/useSession';

export const useBookIconAnimation = () => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'entrance' | 'hold' | 'exit'>('idle');
  const { profile } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousProfileRef = useRef<{ selectedPackage: string; locatie: string } | null>(null);

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

    // Enter hold phase after 400ms
    timeoutRef.current = setTimeout(() => {
      setAnimationPhase('hold');
    }, 400);

    // Enter exit phase after 1000ms (400ms entrance + 600ms hold)
    exitTimeoutRef.current = setTimeout(() => {
      setAnimationPhase('exit');
      // End animation after total 1400ms
      setTimeout(() => {
        setIsGlowing(false);
        setAnimationPhase('idle');
      }, 400);
    }, 1000);
  };

  useEffect(() => {
    // Skip animation on first load
    if (!previousProfileRef.current) {
      previousProfileRef.current = {
        selectedPackage: profile.selectedPackage,
        locatie: profile.locatie
      };
      return;
    }

    // Check if selectedPackage or locatie changed
    const hasChanged = 
      previousProfileRef.current.selectedPackage !== profile.selectedPackage ||
      previousProfileRef.current.locatie !== profile.locatie;

    if (hasChanged) {
      triggerGlowAnimation();
    }

    // Update previous values
    previousProfileRef.current = {
      selectedPackage: profile.selectedPackage,
      locatie: profile.locatie
    };
  }, [profile.selectedPackage, profile.locatie]);

  // Listen for storage events (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProfile' && e.newValue) {
        try {
          const newProfile = JSON.parse(e.newValue);
          const hasChanged = 
            previousProfileRef.current?.selectedPackage !== newProfile.selectedPackage ||
            previousProfileRef.current?.locatie !== newProfile.locatie;

          if (hasChanged) {
            triggerGlowAnimation();
            previousProfileRef.current = {
              selectedPackage: newProfile.selectedPackage,
              locatie: newProfile.locatie
            };
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
    };
  }, []);

  return { isGlowing, animationPhase };
};