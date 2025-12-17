'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';

export interface PopupTransitionState {
  isTransitioning: boolean;
  exitingPopup: string | null;
  enteringPopup: string | null;
  direction: 'cross-fade' | 'slide-up' | 'slide-down';
}

export const usePopupTransition = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [transitionState, setTransitionState] = useState<PopupTransitionState>({
    isTransitioning: false,
    exitingPopup: null,
    enteringPopup: null,
    direction: 'cross-fade'
  });

  const isOnPopupPage = useCallback(() => {
    return pathname.includes('/reviews') || 
           pathname.includes('/missie') || 
           pathname.includes('/mission') ||
           pathname.includes('/info') ||
           pathname.includes('/support') ||
           pathname.includes('/contact') ||
           pathname.includes('/boek') ||
           pathname.includes('/book');
  }, [pathname]);

  const getCurrentPopup = useCallback(() => {
    if (pathname.includes('/reviews')) return 'reviews';
    if (pathname.includes('/missie') || pathname.includes('/mission')) return 'mission';
    if (pathname.includes('/info')) return 'info';
    if (pathname.includes('/support')) return 'support';
    if (pathname.includes('/contact')) return 'contact';
    if (pathname.includes('/boek') || pathname.includes('/book')) return 'booking';
    return null;
  }, [pathname]);

  const startPopupTransition = useCallback((targetPath: string, fromNonPopup = false) => {
    const currentPopup = getCurrentPopup();
    const targetPopup = targetPath.includes('/reviews') ? 'reviews' : 
                       targetPath.includes('/missie') || targetPath.includes('/mission') ? 'mission' :
                       targetPath.includes('/info') ? 'info' :
                       targetPath.includes('/support') ? 'support' :
                       targetPath.includes('/contact') ? 'contact' :
                       targetPath.includes('/boek') || targetPath.includes('/book') ? 'booking' : null;
    
    // Store current path as previous path for the target popup
    if (!isOnPopupPage()) {
      sessionStorage.setItem('previousPath', pathname);
    }
    
    if (currentPopup && currentPopup !== targetPopup && !fromNonPopup) {
      // Cross-fade transition between popups
      setTransitionState({
        isTransitioning: true,
        exitingPopup: currentPopup,
        enteringPopup: targetPopup,
        direction: 'cross-fade'
      });

      // Add iOS-native exit animation to current popup
      const currentPopupElement = document.querySelector('.reviews-page-fullscreen, .info-page-fullscreen, .support-page-fullscreen, .contact-page-fullscreen, .booking-page-fullscreen');
      if (currentPopupElement) {
        currentPopupElement.classList.add('reviews-page-exit');
      }

      // Navigate with iOS timing
      setTimeout(() => {
        router.push(targetPath);
        
        // Reset transition state after navigation
        setTimeout(() => {
          setTransitionState({
            isTransitioning: false,
            exitingPopup: null,
            enteringPopup: null,
            direction: 'cross-fade'
          });
        }, 100);
      }, 350);
    } else {
      // Direct navigation with original slide-up animation
      router.push(targetPath);
    }
  }, [getCurrentPopup, navigate, isOnPopupPage, pathname]);

  const directNavigate = useCallback((targetPath: string) => {
    router.push(targetPath);
  }, [navigate]);

  return {
    transitionState,
    startPopupTransition,
    directNavigate,
    isOnPopupPage,
    getCurrentPopup
  };
};