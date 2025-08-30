import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TransitionState {
  isTransitioning: boolean;
  fadeOut: boolean;
  scaleIn: boolean;
  targetPage: string | null;
  logoScaleUp: boolean;
  logoFadeOut: boolean;
}

export const usePageTransition = () => {
  const navigate = useNavigate();
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    fadeOut: false,
    scaleIn: false,
    targetPage: null,
    logoScaleUp: false,
    logoFadeOut: false
  });

  const startTransition = useCallback((targetPath: string, delay = 0) => {
    document.body.style.overflow = 'hidden';
    
    // Check if target is haartransplantatie or v6-hairboost for logo animation
    const isLogoTransition = targetPath.includes('/haartransplantatie') || 
                            targetPath.includes('/hair-transplant') || 
                            targetPath.includes('/v6-hairboost');
    
    setTransitionState({
      isTransitioning: true,
      fadeOut: true,
      scaleIn: false,
      targetPage: targetPath,
      logoScaleUp: false,
      logoFadeOut: false
    });

    // Start logo animations immediately for smooth transition
    if (isLogoTransition) {
      // Start both scale and fade immediately for parallel effect
      setTransitionState(prev => ({
        ...prev,
        logoScaleUp: true,
        logoFadeOut: true
      }));
    }

    setTimeout(() => {
      const gridItems = document.querySelectorAll('[data-grid-item]');
      gridItems.forEach((item, index) => {
        const delayClass = `grid-item-exit-delay-${index + 1}`;
        item.classList.add('grid-item-exit', delayClass);
      });
    }, 20);

    // Navigate immediately for smoother transition - new page loads while logo animates
    const navigationDelay = isLogoTransition ? 100 : 300;
    
    setTimeout(() => {
      navigate(targetPath);
      
      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          fadeOut: false,
          scaleIn: true,
          logoScaleUp: false,
          logoFadeOut: false
        }));

        // Delay item animations to start after logo transition completes
        setTimeout(() => {
          const pageItems = document.querySelectorAll('[data-page-entry]');
          pageItems.forEach((item) => {
            if (item.classList.contains('page-entry-grid')) {
              item.classList.add('page-entry-grid-visible');
            } else {
              item.classList.add('page-entry-item-visible');
            }
          });
        }, 500); // Delay to let logo animation complete first

        setTimeout(() => {
          setTransitionState({
            isTransitioning: false,
            fadeOut: false,
            scaleIn: false,
            targetPage: null,
            logoScaleUp: false,
            logoFadeOut: false
          });
          
          document.body.style.overflow = '';
        }, 600);
      }, 50);
    }, navigationDelay + delay);
  }, [navigate]);

  return {
    transitionState,
    startTransition
  };
};