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
    console.log('🚀 Starting instant app-like transition to:', targetPath);
    
    // Lock scroll during transition
    document.body.style.overflow = 'hidden';
    
    // Start fade out immediately
    setTransitionState({
      isTransitioning: true,
      fadeOut: true,
      scaleIn: false,
      targetPage: targetPath
    });

    // Apply individual grid item exit classes immediately
    setTimeout(() => {
      const gridItems = document.querySelectorAll('[data-grid-item]');
      gridItems.forEach((item, index) => {
        const delayClass = `grid-item-exit-delay-${index + 1}`;
        item.classList.add('grid-item-exit', delayClass);
      });
      
      console.log('⚡ Applied instant exit animations to', gridItems.length, 'grid items');
    }, 20);

    // Navigate IMMEDIATELY while animations are playing (app-like behavior)
    setTimeout(() => {
      console.log('🔄 Instant navigation while fade-out plays');
      navigate(targetPath);
      
      // Start page entry animations immediately when page loads
      setTimeout(() => {
        console.log('📈 Instant page entry animations');
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
          
          console.log('✨ Applied instant entry animations to', pageItems.length, 'page elements');
        }, 50);

        // Complete transition quickly
        setTimeout(() => {
          console.log('✅ Fast app-like transition complete');
          setTransitionState({
            isTransitioning: false,
            fadeOut: false,
            scaleIn: false,
            targetPage: null
          });
          
          // Restore scroll
          document.body.style.overflow = '';
        }, 600); // Reduced completion time
      }, 50); // Minimal delay to ensure page renders
    }, 150 + delay); // Start navigation almost immediately (150ms allows click feedback)
  }, [navigate]);

  return {
    transitionState,
    startTransition
  };
};