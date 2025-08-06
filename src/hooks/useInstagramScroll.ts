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
  const startScrollPosition = useRef(0);
  const lastScrollTime = useRef(0);
  const animationFrame = useRef<number>();

  // Get section position for smooth scrolling
  const getSectionPosition = useCallback((sectionIndex: number) => {
    const sections = document.querySelectorAll('.snap-section');
    const targetSection = sections[sectionIndex] as HTMLElement;
    return targetSection ? targetSection.offsetTop : 0;
  }, []);

  // Smooth scroll to section with Instagram-like behavior
  const scrollToSection = useCallback((sectionIndex: number, immediate = false) => {
    if (sectionIndex < 0 || sectionIndex >= totalSections) return;
    
    const targetPosition = getSectionPosition(sectionIndex);
    
    if (immediate) {
      window.scrollTo(0, targetPosition);
    } else {
      setIsTransitioning(true);
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      setTimeout(() => setIsTransitioning(false), 500);
    }
    
    setCurrentSection(sectionIndex);
    onSectionChange?.(sectionIndex);
  }, [totalSections, getSectionPosition, onSectionChange]);

  const scrollToNext = useCallback(() => {
    const nextSection = Math.min(currentSection + 1, totalSections - 1);
    scrollToSection(nextSection);
  }, [currentSection, totalSections, scrollToSection]);

  const scrollToPrevious = useCallback(() => {
    const prevSection = Math.max(currentSection - 1, 0);
    scrollToSection(prevSection);
  }, [currentSection, scrollToSection]);

  // Instagram-style touch handling with drag preview
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isTransitioning) return;
    
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    startScrollPosition.current = window.pageYOffset;
    setIsDragging(true);
    
    // Cancel any ongoing scroll animation
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  }, [isTransitioning]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || isTransitioning) return;
    
    touchCurrentY.current = e.touches[0].clientY;
    const deltaY = touchStartY.current - touchCurrentY.current;
    const newScrollPosition = startScrollPosition.current + deltaY;
    
    // Allow continuous scrolling with rubber band effect at edges
    const maxScroll = (totalSections - 1) * window.innerHeight;
    let targetScroll = newScrollPosition;
    
    // Rubber band effect at edges
    if (targetScroll < 0) {
      targetScroll = Math.pow(Math.abs(targetScroll), 0.7) * -0.3;
    } else if (targetScroll > maxScroll) {
      const excess = targetScroll - maxScroll;
      targetScroll = maxScroll + Math.pow(excess, 0.7) * 0.3;
    }
    
    // Immediate scroll update for responsive feel
    window.scrollTo(0, targetScroll);
  }, [isDragging, isTransitioning, totalSections]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const velocity = Math.abs(deltaY) / (Date.now() - lastScrollTime.current || 1);
    
    // Determine target section based on scroll position and velocity
    const currentScrollPosition = window.pageYOffset;
    const sectionHeight = window.innerHeight;
    const currentSectionFloat = currentScrollPosition / sectionHeight;
    const currentSectionIndex = Math.round(currentSectionFloat);
    
    let targetSection = currentSectionIndex;
    
    // Velocity-based section switching (Instagram-like)
    if (velocity > 0.5 && Math.abs(deltaY) > 15) {
      if (deltaY > 0) {
        targetSection = Math.min(currentSection + 1, totalSections - 1);
      } else {
        targetSection = Math.max(currentSection - 1, 0);
      }
    } else if (Math.abs(deltaY) > 50) {
      // Distance-based switching for slower drags
      if (deltaY > 0) {
        targetSection = Math.min(currentSection + 1, totalSections - 1);
      } else {
        targetSection = Math.max(currentSection - 1, 0);
      }
    }
    
    // Snap to target section
    scrollToSection(targetSection);
    lastScrollTime.current = Date.now();
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
    
    // Optimize event listeners with passive settings
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      
      // Clean up animation frame
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd, handleKeyDown]);

  return {
    currentSection,
    containerRef,
    scrollToSection,
    scrollToNext,
    scrollToPrevious,
    isTransitioning,
    isDragging
  };
};