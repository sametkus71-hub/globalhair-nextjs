import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInstagramScrollProps {
  totalSections: number;
  onSectionChange?: (section: number) => void;
}

export const useInstagramScroll = ({ totalSections, onSectionChange }: UseInstagramScrollProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);
  const scrollStartPosition = useRef(0);
  const lastScrollTime = useRef(0);
  const animationFrame = useRef<number | null>(null);

  // Smooth scroll to section with progressive movement
  const scrollToSection = useCallback((sectionIndex: number, smooth = true) => {
    if (sectionIndex < 0 || sectionIndex >= totalSections) return;
    
    const viewportHeight = window.innerHeight;
    const targetScrollY = sectionIndex * viewportHeight;
    
    setIsTransitioning(true);
    setCurrentSection(sectionIndex);
    onSectionChange?.(sectionIndex);
    
    if (smooth) {
      // Smooth animated scroll
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
      setTimeout(() => setIsTransitioning(false), 500);
    } else {
      // Instant scroll for drag updates
      window.scrollTo(0, targetScrollY);
      setIsTransitioning(false);
    }
  }, [totalSections, onSectionChange]);

  // Update scroll position during drag with real-time preview
  const updateScrollPosition = useCallback((deltaY: number) => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = requestAnimationFrame(() => {
      const viewportHeight = window.innerHeight;
      const currentScrollY = scrollStartPosition.current;
      
      // Apply drag with resistance at boundaries
      let newScrollY = currentScrollY - deltaY;
      
      // Add rubber band effect at boundaries
      const maxScroll = (totalSections - 1) * viewportHeight;
      if (newScrollY < 0) {
        newScrollY = newScrollY * 0.3; // Resistance at top
      } else if (newScrollY > maxScroll) {
        const excess = newScrollY - maxScroll;
        newScrollY = maxScroll + (excess * 0.3); // Resistance at bottom
      }
      
      window.scrollTo(0, newScrollY);
    });
  }, [totalSections]);

  const scrollToNext = useCallback(() => {
    const nextSection = Math.min(currentSection + 1, totalSections - 1);
    scrollToSection(nextSection);
  }, [currentSection, totalSections, scrollToSection]);

  const scrollToPrevious = useCallback(() => {
    const prevSection = Math.max(currentSection - 1, 0);
    scrollToSection(prevSection);
  }, [currentSection, scrollToSection]);

  // Instagram-style touch handling with real-time preview
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isTransitioning) return;
    
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    scrollStartPosition.current = window.pageYOffset;
    setIsDragging(true);
    
    // Disable native scroll during drag
    document.body.style.overflow = 'hidden';
    e.preventDefault();
  }, [isTransitioning]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || isTransitioning) return;
    
    touchCurrentY.current = e.touches[0].clientY;
    const deltaY = touchStartY.current - touchCurrentY.current;
    
    // Real-time scroll update during drag
    updateScrollPosition(deltaY);
    e.preventDefault();
  }, [isDragging, isTransitioning, updateScrollPosition]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.style.overflow = '';
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const viewportHeight = window.innerHeight;
    
    // Determine target section based on drag distance and velocity
    const dragThreshold = viewportHeight * 0.25; // 25% of screen height
    let targetSection = currentSection;
    
    if (Math.abs(deltaY) > dragThreshold) {
      if (deltaY > 0 && currentSection < totalSections - 1) {
        targetSection = currentSection + 1;
      } else if (deltaY < 0 && currentSection > 0) {
        targetSection = currentSection - 1;
      }
    }
    
    // Smooth snap to target section
    scrollToSection(targetSection, true);
  }, [isDragging, currentSection, totalSections, scrollToSection]);

  // Simple wheel handling - no debouncing, instant response
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isTransitioning) return;
    
    const now = Date.now();
    
    // Lower threshold and no complex velocity calculations
    if (Math.abs(e.deltaY) > 10 && now - lastScrollTime.current > 150) {
      lastScrollTime.current = now;
      
      if (e.deltaY > 0) {
        scrollToNext();
      } else {
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

  // Intersection observer for tracking current section
  useEffect(() => {
    const sections = document.querySelectorAll('.snap-section');
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (isTransitioning) return;
        
        const visibleEntry = entries.find(entry => entry.isIntersecting && entry.intersectionRatio > 0.5);
        if (visibleEntry) {
          const index = Array.from(sections).indexOf(visibleEntry.target);
          if (index !== -1 && index !== currentSection) {
            setCurrentSection(index);
            onSectionChange?.(index);
          }
        }
      },
      { threshold: [0.5], rootMargin: '0px' }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [currentSection, isTransitioning, onSectionChange]);

  // Event listeners
  useEffect(() => {
    const container = containerRef.current || window;
    
    // Add all touch and wheel events
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      
      // Cleanup on unmount
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      document.body.style.overflow = '';
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd, handleKeyDown]);

  return {
    currentSection,
    containerRef,
    scrollToSection,
    scrollToNext,
    scrollToPrevious,
    isTransitioning
  };
};