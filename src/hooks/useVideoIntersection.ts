import { useEffect, useRef, useState } from 'react';

interface UseVideoIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * Hook that detects when an element is in the viewport.
 * Optimized for video elements to pause/play based on visibility.
 */
export const useVideoIntersection = (options: UseVideoIntersectionOptions = {}) => {
  const [isInViewport, setIsInViewport] = useState(true); // Start as true to allow initial playback
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Find the scrolling container (horizontal scroll grid)
    const scrollContainer = element.closest('[style*="overflowX"]') as HTMLElement;
    if (!scrollContainer) {
      // Fallback if no scroll container found - assume visible
      setIsInViewport(true);
      return;
    }

    const checkVisibility = () => {
      if (!element) return;
      
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      // Check if element is horizontally in view with buffer
      const buffer = 100; // px buffer for preloading
      const isVisible = 
        elementRect.right > containerRect.left - buffer && 
        elementRect.left < containerRect.right + buffer;
      
      const wasInViewport = isInViewport;
      setIsInViewport(isVisible);
      
      // Call callback only on change
      if (wasInViewport !== isVisible) {
        options.onVisibilityChange?.(isVisible);
      }
    };

    // Check visibility initially
    checkVisibility();
    
    // Add scroll listener
    scrollContainer.addEventListener('scroll', checkVisibility, { passive: true });
    
    // Also check on window resize
    window.addEventListener('resize', checkVisibility, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);

  return { isInViewport, elementRef };
};
