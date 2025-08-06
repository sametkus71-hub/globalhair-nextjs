import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInstagramScrollOptions {
  postCount: number;
  enabled?: boolean;
  onPostChange?: (currentPost: number) => void;
}

export const useInstagramScroll = ({ postCount, enabled = true, onPostChange }: UseInstagramScrollOptions) => {
  const [currentPost, setCurrentPost] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startTouchY = useRef(0);
  const currentTouchY = useRef(0);
  const isDragging = useRef(false);
  
  const goToPost = useCallback((postIndex: number) => {
    if (postIndex < 0 || postIndex >= postCount) return;
    
    console.log('🎯 Going to post:', postIndex);
    setIsScrolling(true);
    setCurrentPost(postIndex);
    onPostChange?.(postIndex);
    
    // Use transform for immediate, smooth animation
    const container = containerRef.current;
    if (container) {
      const translateY = -postIndex * 100;
      container.style.transform = `translateY(${translateY}vh)`;
      container.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 300);
  }, [postCount, onPostChange]);

  const nextPost = useCallback(() => {
    if (currentPost < postCount - 1 && !isScrolling) {
      goToPost(currentPost + 1);
    }
  }, [currentPost, postCount, goToPost, isScrolling]);

  const previousPost = useCallback(() => {
    if (currentPost > 0 && !isScrolling) {
      goToPost(currentPost - 1);
    }
  }, [currentPost, goToPost, isScrolling]);

  useEffect(() => {
    if (!enabled) return;
    
    // Prevent all default scrolling only when enabled
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Wheel events for desktop
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isScrolling) return;
      
      console.log('🖱️ Wheel event:', e.deltaY);
      
      // Very sensitive threshold - like Instagram
      if (Math.abs(e.deltaY) > 10) {
        if (e.deltaY > 0 && currentPost < postCount - 1) {
          nextPost();
        } else if (e.deltaY < 0 && currentPost > 0) {
          previousPost();
        }
      }
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (isScrolling) return;
      
      startTouchY.current = e.touches[0].clientY;
      currentTouchY.current = e.touches[0].clientY;
      isDragging.current = true;
      
      console.log('👆 Touch start:', startTouchY.current);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!isDragging.current || isScrolling) return;
      
      currentTouchY.current = e.touches[0].clientY;
      console.log('👆 Touch move:', currentTouchY.current);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging.current || isScrolling) return;
      
      const deltaY = startTouchY.current - currentTouchY.current;
      console.log('👆 Touch end, deltaY:', deltaY);
      
      isDragging.current = false;
      
      // Very sensitive threshold for mobile
      if (Math.abs(deltaY) > 20) {
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

    // Add event listeners with passive: false to prevent default scrolling only when enabled
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('instagram-scroll-next', handleCustomScrollNext);
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('scroll', preventScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('instagram-scroll-next', handleCustomScrollNext);
    };
  }, [currentPost, postCount, isScrolling, nextPost, previousPost, enabled]);

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