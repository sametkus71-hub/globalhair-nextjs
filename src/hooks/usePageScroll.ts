import { useState, useEffect, useCallback, useRef } from 'react';

export const usePageScroll = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchDataRef = useRef({
    startY: 0,
    startTime: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    isTracking: false
  });

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

  // Enhanced mobile touch handling with velocity detection
  useEffect(() => {
    let wheelTimeoutId: number;
    let scrollTimeoutId: number;
    
    const handleWheel = (e: WheelEvent) => {
      // Only prevent default if we're actively managing scroll
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      // Let CSS snap scroll handle small movements
      if (Math.abs(e.deltaY) < 20) return;

      // Debounce wheel events for intentional scrolling
      clearTimeout(wheelTimeoutId);
      wheelTimeoutId = window.setTimeout(() => {
        const sections = getSections();
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
        
        if (nextIndex !== currentSection) {
          scrollToSection(nextIndex);
        }
      }, 100);
    };

    // Advanced touch handling with velocity detection
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const now = Date.now();
      
      touchDataRef.current = {
        startY: touch.screenY,
        startTime: now,
        lastY: touch.screenY,
        lastTime: now,
        velocity: 0,
        isTracking: true
      };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchDataRef.current.isTracking) return;
      
      const touch = e.changedTouches[0];
      const now = Date.now();
      const timeDelta = now - touchDataRef.current.lastTime;
      
      if (timeDelta > 0) {
        const yDelta = touch.screenY - touchDataRef.current.lastY;
        touchDataRef.current.velocity = yDelta / timeDelta;
        touchDataRef.current.lastY = touch.screenY;
        touchDataRef.current.lastTime = now;
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchDataRef.current.isTracking) return;
      
      const touch = e.changedTouches[0];
      const totalDelta = touchDataRef.current.startY - touch.screenY;
      const totalTime = Date.now() - touchDataRef.current.startTime;
      const avgVelocity = Math.abs(touchDataRef.current.velocity);
      
      touchDataRef.current.isTracking = false;
      
      // Enhanced logic: consider both distance and velocity
      const shouldTriggerScroll = (
        (Math.abs(totalDelta) > 50 && avgVelocity > 0.3) || // Fast swipe
        (Math.abs(totalDelta) > 100) || // Long swipe
        (avgVelocity > 1.0) // Very fast movement
      );
      
      if (shouldTriggerScroll && !isScrolling && totalTime > 50) {
        // Add small delay to let CSS snap scroll attempt first
        clearTimeout(scrollTimeoutId);
        scrollTimeoutId = window.setTimeout(() => {
          const sections = getSections();
          const direction = totalDelta > 0 ? 1 : -1;
          const nextIndex = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
          
          if (nextIndex !== currentSection) {
            scrollToSection(nextIndex);
          }
        }, 50);
      }
    };
    
    const handleTouchCancel = () => {
      touchDataRef.current.isTracking = false;
    };

    // Add event listeners with proper passive settings
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      clearTimeout(wheelTimeoutId);
      clearTimeout(scrollTimeoutId);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [currentSection, isScrolling, getSections, scrollToSection]);

  // Enhanced Intersection Observer for better mobile responsiveness
  useEffect(() => {
    const sections = getSections();
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Process entries in order of intersection ratio for more accurate detection
        const sortedEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          
        if (sortedEntries.length > 0) {
          const bestEntry = sortedEntries[0];
          // Lower threshold for mobile to be more responsive
          if (bestEntry.intersectionRatio > 0.3) {
            const index = Array.from(sections).indexOf(bestEntry.target);
            if (index !== -1 && index !== currentSection) {
              setCurrentSection(index);
            }
          }
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9], // Multiple thresholds for better detection
        rootMargin: '-5% 0px' // Smaller margin for more responsive triggering
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [getSections, currentSection]);

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