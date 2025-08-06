import { useState, useEffect, useCallback } from 'react';

export const usePageScroll = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Get all snap sections
  const getSections = useCallback(() => {
    return document.querySelectorAll('.snap-section');
  }, []);

  // Scroll to specific section
  const scrollToSection = useCallback((index: number) => {
    const sections = getSections();
    const targetSection = sections[index];
    
    if (targetSection && !isScrolling) {
      setIsScrolling(true);
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Reset scrolling state after animation
      setTimeout(() => setIsScrolling(false), 800);
    }
  }, [getSections, isScrolling]);

  // Handle wheel events for precise control
  useEffect(() => {
    let timeoutId: number;
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      // Debounce wheel events
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const sections = getSections();
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
        
        if (nextIndex !== currentSection) {
          scrollToSection(nextIndex);
        }
      }, 50);
    };

    // Handle touch events for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].screenY;
      const deltaY = touchStartY - touchEndY;
      
      if (Math.abs(deltaY) > 50 && !isScrolling) { // Minimum swipe distance
        const sections = getSections();
        const direction = deltaY > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
        
        if (nextIndex !== currentSection) {
          scrollToSection(nextIndex);
        }
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSection, isScrolling, getSections, scrollToSection]);

  // Track current section with Intersection Observer
  useEffect(() => {
    const sections = getSections();
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Array.from(sections).indexOf(entry.target);
            if (index !== -1) {
              setCurrentSection(index);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [getSections]);

  // Scroll to next section
  const scrollToNext = useCallback(() => {
    const sections = getSections();
    const nextIndex = Math.min(currentSection + 1, sections.length - 1);
    scrollToSection(nextIndex);
  }, [currentSection, getSections, scrollToSection]);

  return {
    currentSection,
    scrollToSection,
    scrollToNext,
    isScrolling
  };
};