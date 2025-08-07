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
           location.pathname.includes('/mission');
  }, [location.pathname]);

  const getCurrentPopup = useCallback(() => {
    if (location.pathname.includes('/reviews')) return 'reviews';
    if (location.pathname.includes('/missie') || location.pathname.includes('/mission')) return 'mission';
    return null;
  }, [location.pathname]);

  const startPopupTransition = useCallback((targetPath: string) => {
    const currentPopup = getCurrentPopup();
    const targetPopup = targetPath.includes('/reviews') ? 'reviews' : 'mission';
    
    if (currentPopup && currentPopup !== targetPopup) {
      // Start cross-fade transition
      setTransitionState({
        isTransitioning: true,
        exitingPopup: currentPopup,
        enteringPopup: targetPopup,
        direction: 'cross-fade'
      });

      // Add exit animation to current popup
      const currentPopupElement = document.querySelector('.reviews-page-fullscreen');
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
      // Direct navigation if not transitioning between popups
      navigate(targetPath);
    }
  }, [getCurrentPopup, navigate]);

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