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

    console.log('⏱️ Fade out started');

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
        }, 300); // Scale in duration
      }, 50); // Small delay to ensure page is rendered
    }, 350 + delay); // Wait for content fade out (350ms) + any delay
  }, [navigate]);

  return {
    transitionState,
    startTransition
  };
};