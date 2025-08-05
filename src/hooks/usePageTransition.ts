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
    console.log('🚀 Starting app-like transition to:', targetPath);
    
    // Lock scroll during transition
    document.body.style.overflow = 'hidden';
    
    // Start fade out with staggered grid items
    setTransitionState({
      isTransitioning: true,
      fadeOut: true,
      scaleIn: false,
      targetPage: targetPath
    });

    console.log('⏱️ Staggered exit animations started');
    
    // Apply individual grid item exit classes
    setTimeout(() => {
      const gridItems = document.querySelectorAll('[data-grid-item]');
      gridItems.forEach((item, index) => {
        const delayClass = `grid-item-exit-delay-${index + 1}`;
        item.classList.add('grid-item-exit', delayClass);
      });
      
      console.log('🎯 Applied exit animations to', gridItems.length, 'grid items');
    }, 50);

    // Navigate after all exit animations complete
    setTimeout(() => {
      console.log('🔄 Navigating to new page');
      navigate(targetPath);
      
      // Start page entry animations
      setTimeout(() => {
        console.log('📈 Page entry animations started');
        setTransitionState(prev => ({
          ...prev,
          fadeOut: false,
          scaleIn: true
        }));

        // Trigger individual page element animations
        setTimeout(() => {
          const pageItems = document.querySelectorAll('[data-page-entry]');
          pageItems.forEach((item) => {
            item.classList.add('page-entry-item-visible');
          });
          
          console.log('✨ Applied entry animations to', pageItems.length, 'page elements');
        }, 100);

        // Complete transition
        setTimeout(() => {
          console.log('✅ App-like transition complete');
          setTransitionState({
            isTransitioning: false,
            fadeOut: false,
            scaleIn: false,
            targetPage: null
          });
          
          // Restore scroll
          document.body.style.overflow = '';
        }, 800); // Allow time for all entry animations
      }, 100); // Small delay to ensure page is rendered
    }, 750 + delay); // Wait for staggered exit animations (750ms) + any delay
  }, [navigate]);

  return {
    transitionState,
    startTransition
  };
};