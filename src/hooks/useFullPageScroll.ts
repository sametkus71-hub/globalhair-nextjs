import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollState {
  currentSection: number;
  isTransitioning: boolean;
  totalSections: number;
}

export const useFullPageScroll = () => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    currentSection: 0,
    isTransitioning: false,
    totalSections: 0
  });
  
  const containerRef = useRef<HTMLElement | null>(null);
  const touchRef = useRef({
    startY: 0,
    startTime: 0,
    isActive: false
  });
  
  // Get container and sections
  const getContainer = useCallback(() => {
    if (!containerRef.current) {
      containerRef.current = document.querySelector('.fullpage-container');
    }
    return containerRef.current;
  }, []);
  
  const getSections = useCallback(() => {
    return document.querySelectorAll('.snap-section');
  }, []);
  
  // Initialize sections count
  useEffect(() => {
    const sections = getSections();
    setScrollState(prev => ({ ...prev, totalSections: sections.length }));
  }, [getSections]);
  
  // Core scroll function with transform
  const scrollToSection = useCallback((targetIndex: number, immediate = false) => {
    if (scrollState.isTransitioning) return;
    
    const sections = getSections();
    const container = getContainer();
    
    if (!container || !sections.length) return;
    
    const clampedIndex = Math.max(0, Math.min(targetIndex, sections.length - 1));
    if (clampedIndex === scrollState.currentSection) return;
    
    setScrollState(prev => ({ 
      ...prev, 
      currentSection: clampedIndex, 
      isTransitioning: true 
    }));
    
    // Use transform for instant, reliable positioning
    const translateY = -clampedIndex * 100;
    
    if (immediate) {
      container.style.transition = 'none';
      container.style.transform = `translateY(${translateY}vh)`;
      
      // Force reflow then re-enable transitions
      container.offsetHeight;
      container.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      setTimeout(() => {
        setScrollState(prev => ({ ...prev, isTransitioning: false }));
      }, 50);
    } else {
      container.style.transform = `translateY(${translateY}vh)`;
      
      setTimeout(() => {
        setScrollState(prev => ({ ...prev, isTransitioning: false }));
      }, 600);
    }
  }, [scrollState.currentSection, scrollState.isTransitioning, getSections, getContainer]);
  
  // Prevent all native scrolling
  useEffect(() => {
    const preventScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault();
    };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (scrollState.isTransitioning) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = scrollState.currentSection + direction;
      
      if (nextIndex >= 0 && nextIndex < scrollState.totalSections) {
        scrollToSection(nextIndex);
      }
    };
    
    // Touch handling - simple and reliable
    const handleTouchStart = (e: TouchEvent) => {
      if (scrollState.isTransitioning) {
        e.preventDefault();
        return;
      }
      
      const touch = e.touches[0];
      touchRef.current = {
        startY: touch.clientY,
        startTime: Date.now(),
        isActive: true
      };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent any native scrolling
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchRef.current.isActive || scrollState.isTransitioning) {
        e.preventDefault();
        return;
      }
      
      const touch = e.changedTouches[0];
      const deltaY = touchRef.current.startY - touch.clientY;
      const deltaTime = Date.now() - touchRef.current.startTime;
      
      touchRef.current.isActive = false;
      
      // Simple threshold-based detection
      const minSwipeDistance = 50;
      const minSwipeTime = 100;
      
      if (Math.abs(deltaY) > minSwipeDistance && deltaTime > minSwipeTime) {
        const direction = deltaY > 0 ? 1 : -1;
        const nextIndex = scrollState.currentSection + direction;
        
        if (nextIndex >= 0 && nextIndex < scrollState.totalSections) {
          scrollToSection(nextIndex);
        }
      }
    };
    
    const handleTouchCancel = () => {
      touchRef.current.isActive = false;
    };
    
    // Add listeners to document for full control
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('scroll', preventScroll, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchCancel, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('scroll', preventScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [scrollState.currentSection, scrollState.isTransitioning, scrollState.totalSections, scrollToSection]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (scrollState.isTransitioning) return;
      
      let direction = 0;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        direction = 1;
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        direction = -1;
        e.preventDefault();
      } else if (e.key === 'Home') {
        scrollToSection(0);
        e.preventDefault();
        return;
      } else if (e.key === 'End') {
        scrollToSection(scrollState.totalSections - 1);
        e.preventDefault();
        return;
      }
      
      if (direction !== 0) {
        const nextIndex = scrollState.currentSection + direction;
        if (nextIndex >= 0 && nextIndex < scrollState.totalSections) {
          scrollToSection(nextIndex);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollState.currentSection, scrollState.isTransitioning, scrollState.totalSections, scrollToSection]);
  
  // Scroll to next section helper
  const scrollToNext = useCallback(() => {
    const nextIndex = scrollState.currentSection + 1;
    if (nextIndex < scrollState.totalSections) {
      scrollToSection(nextIndex);
    }
  }, [scrollState.currentSection, scrollState.totalSections, scrollToSection]);
  
  // Initialize scroll position
  const initializeScroll = useCallback(() => {
    scrollToSection(0, true);
  }, [scrollToSection]);
  
  return {
    currentSection: scrollState.currentSection,
    totalSections: scrollState.totalSections,
    isTransitioning: scrollState.isTransitioning,
    scrollToSection,
    scrollToNext,
    initializeScroll
  };
};