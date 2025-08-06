import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInstagramScrollProps {
  totalSections: number;
  onSectionChange?: (section: number) => void;
}

export const useInstagramScroll = ({ totalSections, onSectionChange }: UseInstagramScrollProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const lastTouchTime = useRef<number>(0);

  // Scroll to specific section
  const scrollToSection = useCallback((sectionIndex: number) => {
    if (isTransitioning || sectionIndex < 0 || sectionIndex >= totalSections) return;
    
    setIsTransitioning(true);
    setCurrentSection(sectionIndex);
    onSectionChange?.(sectionIndex);
    
    if (containerRef.current) {
      const translateY = -sectionIndex * 100;
      containerRef.current.style.transform = `translateY(${translateY}vh)`;
    }
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, totalSections, onSectionChange]);

  // Navigate to next section
  const scrollToNext = useCallback(() => {
    if (currentSection < totalSections - 1) {
      scrollToSection(currentSection + 1);
    }
  }, [currentSection, totalSections, scrollToSection]);

  // Navigate to previous section
  const scrollToPrevious = useCallback(() => {
    if (currentSection > 0) {
      scrollToSection(currentSection - 1);
    }
  }, [currentSection, scrollToSection]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isTransitioning) return;
    touchStartY.current = e.touches[0].clientY;
    lastTouchTime.current = Date.now();
  }, [isTransitioning]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (isTransitioning) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const touchDiff = touchStartY.current - touchEndY;
    const timeDiff = Date.now() - lastTouchTime.current;
    
    // Minimum swipe distance and maximum time for quick swipes
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    
    if (Math.abs(touchDiff) >= minSwipeDistance && timeDiff <= maxSwipeTime) {
      if (touchDiff > 0) {
        // Swipe up - go to next section
        scrollToNext();
      } else {
        // Swipe down - go to previous section
        scrollToPrevious();
      }
    }
  }, [isTransitioning, scrollToNext, scrollToPrevious]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isTransitioning) return;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        scrollToNext();
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        scrollToPrevious();
        break;
      case 'Home':
        e.preventDefault();
        scrollToSection(0);
        break;
      case 'End':
        e.preventDefault();
        scrollToSection(totalSections - 1);
        break;
    }
  }, [isTransitioning, scrollToNext, scrollToPrevious, scrollToSection, totalSections]);

  // Prevent native scrolling and set up event listeners
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning) return;
      
      if (e.deltaY > 0) {
        scrollToNext();
      } else {
        scrollToPrevious();
      }
    };

    // Disable native scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Add event listeners
    document.addEventListener('wheel', preventWheel, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Re-enable native scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Remove event listeners
      document.removeEventListener('wheel', preventWheel);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTransitioning, scrollToNext, scrollToPrevious, handleTouchStart, handleTouchEnd, handleKeyDown]);

  return {
    currentSection,
    containerRef,
    scrollToSection,
    scrollToNext: scrollToNext,
    scrollToPrevious,
    isTransitioning,
  };
};