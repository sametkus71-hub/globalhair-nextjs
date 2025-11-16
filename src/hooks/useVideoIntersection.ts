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
  const [isInViewport, setIsInViewport] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsInViewport(isVisible);
        options.onVisibilityChange?.(isVisible);
      },
      {
        threshold: options.threshold || 0.3, // 30% visible = considered in viewport
        rootMargin: options.rootMargin || '50px', // Small buffer for smooth transitions
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  return { isInViewport, elementRef };
};
