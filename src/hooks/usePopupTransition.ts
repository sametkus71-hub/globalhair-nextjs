import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface PopupTransitionState {
  isTransitioning: boolean;
  exitingPopup: string | null;
  enteringPopup: string | null;
  direction: 'cross-fade' | 'slide-up' | 'slide-down';
}

export const usePopupTransition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transitionState, setTransitionState] = useState<PopupTransitionState>({
    isTransitioning: false,
    exitingPopup: null,
    enteringPopup: null,
    direction: 'cross-fade'
  });

  const isOnPopupPage = useCallback(() => {
    return location.pathname.includes('/reviews') || 
           location.pathname.includes('/missie') || 
           location.pathname.includes('/mission') ||
           location.pathname.includes('/info') ||
           location.pathname.includes('/support') ||
           location.pathname.includes('/contact') ||
           location.pathname.includes('/boek') ||
           location.pathname.includes('/book');
  }, [location.pathname]);

  const getCurrentPopup = useCallback(() => {
    if (location.pathname.includes('/reviews')) return 'reviews';
    if (location.pathname.includes('/missie') || location.pathname.includes('/mission')) return 'mission';
    if (location.pathname.includes('/info')) return 'info';
    if (location.pathname.includes('/support')) return 'support';
    if (location.pathname.includes('/contact')) return 'contact';
    if (location.pathname.includes('/boek') || location.pathname.includes('/book')) return 'booking';
    return null;
  }, [location.pathname]);

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
      sessionStorage.setItem('previousPath', location.pathname);
    }
    
    if (currentPopup && currentPopup !== targetPopup && !fromNonPopup) {
      // Cross-fade transition between popups
      setTransitionState({
        isTransitioning: true,
        exitingPopup: currentPopup,
        enteringPopup: targetPopup,
        direction: 'cross-fade'
      });

      // Add exit animation to current popup
      const currentPopupElement = document.querySelector('.reviews-page-fullscreen, .info-page-fullscreen, .support-page-fullscreen, .contact-page-fullscreen, .booking-page-fullscreen');
      if (currentPopupElement) {
        currentPopupElement.classList.add('popup-cross-fade-exit');
      }

      // Navigate after a short delay
      setTimeout(() => {
        navigate(targetPath);
        
        // Reset transition state after navigation
        setTimeout(() => {
          setTransitionState({
            isTransitioning: false,
            exitingPopup: null,
            enteringPopup: null,
            direction: 'cross-fade'
          });
        }, 100);
      }, 200);
    } else {
      // Direct navigation with original slide-up animation
      navigate(targetPath);
    }
  }, [getCurrentPopup, navigate, isOnPopupPage, location.pathname]);

  const directNavigate = useCallback((targetPath: string) => {
    navigate(targetPath);
  }, [navigate]);

  return {
    transitionState,
    startPopupTransition,
    directNavigate,
    isOnPopupPage,
    getCurrentPopup
  };
};