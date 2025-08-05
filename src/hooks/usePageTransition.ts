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
    console.log('🚀 Starting transition to:', targetPath);
    
    // Lock scroll during transition
    document.body.style.overflow = 'hidden';
    
    // Start fade out
    setTransitionState({
      isTransitioning: true,
      fadeOut: true,
      scaleIn: false,
      targetPage: targetPath
    });

    console.log('⏱️ Fade out started - classes should be applied now');
    
    // Log all elements with transition classes after a short delay
    setTimeout(() => {
      const fadeOutElements = document.querySelectorAll('.page-transition-fade-out');
      const buttonFadeElements = document.querySelectorAll('.page-transition-buttons-fade');
      console.log('🔍 Elements with fade-out class:', fadeOutElements.length);
      console.log('🔍 Elements with button-fade class:', buttonFadeElements.length);
      
      if (fadeOutElements.length > 0) {
        console.log('📊 First fade-out element styles:', window.getComputedStyle(fadeOutElements[0]));
      }
    }, 100);

    // Navigate after fade out completes (wait for CSS animation)
    setTimeout(() => {
      console.log('🔄 Navigating to new page');
      navigate(targetPath);
      
      // Start scale in after navigation
      setTimeout(() => {
        console.log('📈 Scale in started');
        setTransitionState(prev => ({
          ...prev,
          fadeOut: false,
          scaleIn: true
        }));

        // Complete transition
        setTimeout(() => {
          console.log('✅ Transition complete');
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
    }, 600 + delay); // Wait for content fade out (600ms) + any delay
  }, [navigate]);

  return {
    transitionState,
    startTransition
  };
};