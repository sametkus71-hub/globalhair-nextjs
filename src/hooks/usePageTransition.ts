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
      logoScaleUp: isLogoTransition,
      logoFadeOut: false
    });

    // Start logo scale animation immediately if it's a logo transition
    if (isLogoTransition) {
      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          logoFadeOut: true
        }));
      }, 400); // Start fade after scale animation
    }

    setTimeout(() => {
      const gridItems = document.querySelectorAll('[data-grid-item]');
      gridItems.forEach((item, index) => {
        const delayClass = `grid-item-exit-delay-${index + 1}`;
        item.classList.add('grid-item-exit', delayClass);
      });
    }, 20);

    // Extended delay for logo transition to complete
    const navigationDelay = isLogoTransition ? 600 : 300;
    
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

        setTimeout(() => {
          const pageItems = document.querySelectorAll('[data-page-entry]');
          pageItems.forEach((item) => {
            if (item.classList.contains('page-entry-grid')) {
              item.classList.add('page-entry-grid-visible');
            } else {
              item.classList.add('page-entry-item-visible');
            }
          });
        }, 50);

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