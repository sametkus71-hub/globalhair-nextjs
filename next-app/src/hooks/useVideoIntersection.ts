'use client';

import { useEffect, useRef, useState } from 'react';

interface UseVideoIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * Hook that detects when an element is in the viewport.
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
  const [isInViewport, setIsInViewport] = useState(false); // Start as false to prevent all videos loading at once
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Find the closest horizontal scrolling container with data-scroll-container attribute
    // Note: use closest() or fallback to window/document scanning if needed
    let scrollContainer = element.closest('[data-scroll-container]') as HTMLElement;

    // Fallback: If no explicit container, try to find the reviews-scrollbar specifically
    if (!scrollContainer) {
      scrollContainer = document.querySelector('.reviews-scrollbar') as HTMLElement;
    }

    if (!scrollContainer) {
      // If still no container, fallback to always visible (safe default)
      setIsInViewport(true);
      return;
    }

    const checkVisibility = () => {
      if (!element) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Check if element is horizontally in view with buffer
      const buffer = 200; // Increased px buffer for preloading
      const isVisible =
        elementRect.right > containerRect.left - buffer &&
        elementRect.left < containerRect.right + buffer;

      setIsInViewport(isVisible);
      options.onVisibilityChange?.(isVisible);
    };

    // Check visibility initially
    checkVisibility();

    // Add scroll listener with throttling ideally, but raw is fine for now
    scrollContainer.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []); // Empty dependency array is fine here as long as ref is stable

  return { isInViewport, elementRef };
};
