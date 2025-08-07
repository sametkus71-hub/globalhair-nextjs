import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface SlideTransitionState {
  isTransitioning: boolean;
  direction: 'slide-left' | 'slide-right' | null;
  exitingPage: string | null;
  enteringPage: string | null;
}

export const useSlideTransition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transitionState, setTransitionState] = useState<SlideTransitionState>({
    isTransitioning: false,
    direction: null,
    exitingPage: null,
    enteringPage: null
  });

  const isReviewItemPage = useCallback(() => {
    return location.pathname.includes('/reviews/item');
  }, [location.pathname]);

  const isReviewsPage = useCallback(() => {
    return location.pathname.includes('/reviews') && !location.pathname.includes('/reviews/item');
  }, [location.pathname]);

  const startSlideTransition = useCallback((targetPath: string, direction: 'slide-left' | 'slide-right') => {
    setTransitionState({
      isTransitioning: true,
      direction,
      exitingPage: location.pathname,
      enteringPage: targetPath
    });

    // Add exit animation to current page
    const currentPageElement = document.querySelector('.reviews-page-fullscreen, .review-item-page-fullscreen');
    if (currentPageElement) {
      if (direction === 'slide-left') {
        currentPageElement.classList.add('slide-exit-left');
      } else {
        currentPageElement.classList.add('slide-exit-right');
      }
    }

    // Navigate after animation starts
    setTimeout(() => {
      navigate(targetPath);
      
      // Reset transition state after navigation
      setTimeout(() => {
        setTransitionState({
          isTransitioning: false,
          direction: null,
          exitingPage: null,
          enteringPage: null
        });
      }, 100);
    }, 200);
  }, [navigate, location.pathname]);

  const slideToItem = useCallback((targetPath: string) => {
    startSlideTransition(targetPath, 'slide-left');
  }, [startSlideTransition]);

  const slideBackToReviews = useCallback((targetPath: string) => {
    startSlideTransition(targetPath, 'slide-right');
  }, [startSlideTransition]);

  return {
    transitionState,
    slideToItem,
    slideBackToReviews,
    isReviewItemPage,
    isReviewsPage
  };
};