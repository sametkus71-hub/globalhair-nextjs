import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TransitionState {
  isTransitioning: boolean;
  fadeOut: boolean;
  scaleIn: boolean;
  targetPage: string | null;
}

export const usePageTransition = () => {
  const navigate = useNavigate();
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    fadeOut: false,
    scaleIn: false,
    targetPage: null
  });

  const startTransition = useCallback((targetPath: string, delay = 0) => {
    // Lock scroll during transition
    document.body.style.overflow = 'hidden';
    
    // Start fade out
    setTransitionState({
      isTransitioning: true,
      fadeOut: true,
      scaleIn: false,
      targetPage: targetPath
    });

    // Navigate after fade out completes
    setTimeout(() => {
      navigate(targetPath);
      
      // Start scale in after navigation
      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          fadeOut: false,
          scaleIn: true
        }));

        // Complete transition
        setTimeout(() => {
          setTransitionState({
            isTransitioning: false,
            fadeOut: false,
            scaleIn: false,
            targetPage: null
          });
          
          // Restore scroll
          document.body.style.overflow = '';
        }, 400); // Scale in duration
      }, 50); // Small delay to ensure page is rendered
    }, 350 + delay); // Fade out duration + any delay
  }, [navigate]);

  return {
    transitionState,
    startTransition
  };
};