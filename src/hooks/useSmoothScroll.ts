import { useState, useEffect, useCallback } from 'react';

interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const { duration = 800, easing = (t) => t * t * (3 - 2 * t) } = options;
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToElement = useCallback((target: string | HTMLElement, offset = 0) => {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    setIsScrolling(true);

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easing(progress);
      
      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateScroll);
  }, [duration, easing]);

  const scrollToTop = useCallback(() => {
    scrollToElement(document.body, 0);
  }, [scrollToElement]);

  return { scrollToElement, scrollToTop, isScrolling };
};