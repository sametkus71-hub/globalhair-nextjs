import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollZone {
  id: string;
  element: HTMLElement;
  start: number;
  end: number;
}

interface UseScrollZonesOptions {
  onZoneChange?: (zoneId: string | null) => void;
  threshold?: number;
}

export const useScrollZones = (options: UseScrollZonesOptions = {}) => {
  const { onZoneChange, threshold = 100 } = options;
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [isInInstagramZone, setIsInInstagramZone] = useState(false);
  const zonesRef = useRef<ScrollZone[]>([]);
  const instagramSectionRef = useRef<HTMLElement | null>(null);

  const registerZone = useCallback((id: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    
    const zone: ScrollZone = {
      id,
      element,
      start: rect.top + scrollTop,
      end: rect.top + scrollTop + rect.height
    };

    zonesRef.current = zonesRef.current.filter(z => z.id !== id);
    zonesRef.current.push(zone);

    // Special handling for Instagram section
    if (id === 'instagram-posts') {
      instagramSectionRef.current = element;
    }
  }, []);

  const unregisterZone = useCallback((id: string) => {
    zonesRef.current = zonesRef.current.filter(z => z.id !== id);
    if (id === 'instagram-posts') {
      instagramSectionRef.current = null;
    }
  }, []);

  const checkCurrentZone = useCallback(() => {
    const scrollTop = window.pageYOffset + threshold;
    const viewportHeight = window.innerHeight;
    
    let newZone: string | null = null;
    
    for (const zone of zonesRef.current) {
      if (scrollTop >= zone.start && scrollTop < zone.end) {
        newZone = zone.id;
        break;
      }
    }

    // Check if we're in Instagram zone specifically
    const inInstagram = newZone === 'instagram-posts';
    
    if (inInstagram !== isInInstagramZone) {
      setIsInInstagramZone(inInstagram);
      
      // Toggle body scroll behavior
      if (inInstagram) {
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
      } else {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      }
    }

    if (newZone !== currentZone) {
      setCurrentZone(newZone);
      onZoneChange?.(newZone);
    }
  }, [currentZone, isInInstagramZone, threshold, onZoneChange]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isInInstagramZone) {
        checkCurrentZone();
      }
    };

    const handleResize = () => {
      // Recalculate zone positions on resize
      zonesRef.current.forEach(zone => {
        const rect = zone.element.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        zone.start = rect.top + scrollTop;
        zone.end = rect.top + scrollTop + rect.height;
      });
      checkCurrentZone();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Initial check
    checkCurrentZone();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      // Clean up body styles
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [checkCurrentZone, isInInstagramZone]);

  return {
    currentZone,
    isInInstagramZone,
    registerZone,
    unregisterZone,
    instagramSectionRef: instagramSectionRef.current
  };
};