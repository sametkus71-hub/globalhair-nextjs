import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInstagramScrollProps {
  totalSections: number;
  onSectionChange?: (section: number) => void;
}

export const useInstagramScroll = ({ totalSections, onSectionChange }: UseInstagramScrollProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  // Simple scroll to section with immediate response
  const scrollToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex < 0 || sectionIndex >= totalSections || isTransitioning) return;
    
    const sections = document.querySelectorAll('.snap-section');
    const targetSection = sections[sectionIndex] as HTMLElement;
    
    if (targetSection) {
      setIsTransitioning(true);
      setCurrentSection(sectionIndex);
      onSectionChange?.(sectionIndex);
      
      // Use smooth scrollIntoView for Instagram-like behavior
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Short transition lock
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [totalSections, isTransitioning, onSectionChange]);

  const scrollToNext = useCallback(() => {
    const nextSection = Math.min(currentSection + 1, totalSections - 1);
    scrollToSection(nextSection);
  }, [currentSection, totalSections, scrollToSection]);

  const scrollToPrevious = useCallback(() => {
    const prevSection = Math.max(currentSection - 1, 0);
    scrollToSection(prevSection);
  }, [currentSection, scrollToSection]);

  // Lightweight touch handling - lower threshold, no velocity calculations
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (isTransitioning) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const now = Date.now();
    
    // Much lower threshold for instant response (20px instead of 50+)
    if (Math.abs(deltaY) > 20 && now - lastScrollTime.current > 100) {
      lastScrollTime.current = now;
      
      if (deltaY > 0) {
        scrollToNext();
      } else {
        scrollToPrevious();
      }
    }
  }, [isTransitioning, scrollToNext, scrollToPrevious]);

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
    
    // Optimize event listeners with passive settings
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd, handleKeyDown]);

  return {
    currentSection,
    containerRef,
    scrollToSection,
    scrollToNext,
    scrollToPrevious,
    isTransitioning
  };
};