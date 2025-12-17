'use client';

import { useState, useEffect } from 'react';

interface UseScrollFadeOptions {
  threshold?: number;
  element?: HTMLElement | null;
}

export const useScrollFade = ({ threshold = 50, element }: UseScrollFadeOptions = {}) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const targetElement = element || window;
    
    const handleScroll = () => {
      const currentScrollY = element ? element.scrollTop : window.scrollY;
      setScrollY(currentScrollY);
      setIsVisible(currentScrollY < threshold);
    };

    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [threshold, element]);

  const opacity = Math.max(0, Math.min(1, 1 - (scrollY / threshold)));

  return { isVisible, opacity, scrollY };
};