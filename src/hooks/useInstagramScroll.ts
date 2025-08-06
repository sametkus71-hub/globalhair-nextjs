import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInstagramScrollOptions {
  postCount: number;
  onPostChange?: (currentPost: number) => void;
}

export const useInstagramScroll = ({ postCount, onPostChange }: UseInstagramScrollOptions) => {
  const [currentPost, setCurrentPost] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startTouchY = useRef(0);
  const scrollAccumulator = useRef(0);
  
  const goToPost = useCallback((postIndex: number) => {
    if (postIndex < 0 || postIndex >= postCount || isScrolling) return;
    
    setIsScrolling(true);
    setCurrentPost(postIndex);
    onPostChange?.(postIndex);
    
    // Use transform for immediate, smooth animation
    const container = containerRef.current;
    if (container) {
      const translateY = -postIndex * 100;
      container.style.transform = `translateY(${translateY}vh)`;
    }
    
    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 350);
  }, [postCount, isScrolling, onPostChange]);

  const nextPost = useCallback(() => {
    if (currentPost < postCount - 1) {
      goToPost(currentPost + 1);
    }
  }, [currentPost, postCount, goToPost]);

  const previousPost = useCallback(() => {
    if (currentPost > 0) {
      goToPost(currentPost - 1);
    }
  }, [currentPost, goToPost]);

  useEffect(() => {
    // Wheel events for desktop
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      // Accumulate scroll delta for sensitivity
      scrollAccumulator.current += e.deltaY;

      // Very sensitive threshold - like Instagram
      if (Math.abs(scrollAccumulator.current) > 15) {
        e.preventDefault();
        
        if (scrollAccumulator.current > 0 && currentPost < postCount - 1) {
          nextPost();
        } else if (scrollAccumulator.current < 0 && currentPost > 0) {
          previousPost();
        }
        
        scrollAccumulator.current = 0;
      }
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (isScrolling) return;
      startTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }
      
      const currentTouchY = e.touches[0].clientY;
      const deltaY = startTouchY.current - currentTouchY;
      
      // Immediate response to small touch movements
      if (Math.abs(deltaY) > 20) {
        e.preventDefault();
        
        if (deltaY > 0 && currentPost < postCount - 1) {
          // Swiped up - go to next post
          nextPost();
        } else if (deltaY < 0 && currentPost > 0) {
          // Swiped down - go to previous post
          previousPost();
        }
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      switch (e.key) {
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          nextPost();
          break;
        case 'ArrowUp':
          e.preventDefault();
          previousPost();
          break;
      }
    };

    // Custom event from floating button
    const handleCustomScrollNext = () => {
      if (!isScrolling) {
        nextPost();
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('instagram-scroll-next', handleCustomScrollNext);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('instagram-scroll-next', handleCustomScrollNext);
    };
  }, [currentPost, postCount, isScrolling, nextPost, previousPost]);

  return {
    currentPost,
    isScrolling,
    nextPost,
    previousPost,
    goToPost,
    containerRef,
    canGoNext: currentPost < postCount - 1,
    canGoPrevious: currentPost > 0
  };
};