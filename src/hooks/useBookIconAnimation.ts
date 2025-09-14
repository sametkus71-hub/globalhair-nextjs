import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/hooks/useSession';

export const useBookIconAnimation = () => {
  const [isGlowing, setIsGlowing] = useState(false);
  const { profile } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousProfileRef = useRef<{ selectedPackage: string; locatie: string } | null>(null);

  const triggerGlowAnimation = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start glow effect
    setIsGlowing(true);

    // Schedule glow removal after total duration (400ms fade in + 1000ms hold + 400ms fade out)
    timeoutRef.current = setTimeout(() => {
      setIsGlowing(false);
    }, 1400);
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isGlowing };
};