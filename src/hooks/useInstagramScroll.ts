import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInstagramScrollOptions {
  postCount: number;
  onPostChange?: (currentPost: number) => void;
}

export const useInstagramScroll = ({ postCount, onPostChange }: UseInstagramScrollOptions) => {
  const [currentPost, setCurrentPost] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollTimeRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('down');
  
  const goToPost = useCallback((postIndex: number) => {
    if (postIndex < 0 || postIndex >= postCount || isScrolling) return;
    
    setIsScrolling(true);
    setCurrentPost(postIndex);
    onPostChange?.(postIndex);
    
    // Scroll to the specific post
    const postElement = document.querySelector(`[data-post-index="${postIndex}"]`);
    if (postElement) {
      postElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 800);
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
    const handleScroll = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      const deltaY = e.deltaY;
      
      // Determine scroll direction
      scrollDirectionRef.current = deltaY > 0 ? 'down' : 'up';
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce scroll events
      if (now - lastScrollTimeRef.current < 150) {
        return;
      }
      
      lastScrollTimeRef.current = now;
      
      // Only snap if scroll is significant enough
      if (Math.abs(deltaY) > 50) {
        e.preventDefault();
        
        if (deltaY > 0 && currentPost < postCount - 1) {
          // Scroll down
          nextPost();
        } else if (deltaY < 0 && currentPost > 0) {
          // Scroll up
          previousPost();
        }
      }
    };

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
        case 'Home':
          e.preventDefault();
          goToPost(0);
          break;
        case 'End':
          e.preventDefault();
          goToPost(postCount - 1);
          break;
      }
    };

    const handleCustomScrollNext = () => {
      if (!isScrolling) {
        nextPost();
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('instagram-scroll-next', handleCustomScrollNext);
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('instagram-scroll-next', handleCustomScrollNext);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentPost, postCount, isScrolling, nextPost, previousPost, goToPost]);

  return {
    currentPost,
    isScrolling,
    nextPost,
    previousPost,
    goToPost,
    canGoNext: currentPost < postCount - 1,
    canGoPrevious: currentPost > 0
  };
};