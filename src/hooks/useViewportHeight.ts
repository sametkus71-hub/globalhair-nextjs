import { useState, useEffect } from 'react';

type HeightBreakpoint = 'small' | 'medium' | 'large';

export const useViewportHeight = () => {
  const [height, setHeight] = useState(0);
  const [heightBreakpoint, setHeightBreakpoint] = useState<HeightBreakpoint>('large');

  useEffect(() => {
    const updateHeight = () => {
      let viewportHeight: number;
      
      // Use Visual Viewport API if available (works on all modern browsers)
      if (window.visualViewport) {
        viewportHeight = window.visualViewport.height;
      } else {
        viewportHeight = window.innerHeight;
      }
      
      setHeight(viewportHeight);
      
      // Set CSS custom properties - overrides the CSS fallback with precise values
      document.documentElement.style.setProperty('--app-height', `${viewportHeight}px`);
      document.documentElement.style.setProperty('--safe-area-height', `${viewportHeight}px`);
      
      // Determine breakpoint based on height
      if (viewportHeight < 700) {
        setHeightBreakpoint('small');
      } else if (viewportHeight < 850) {
        setHeightBreakpoint('medium');
      } else {
        setHeightBreakpoint('large');
      }
    };

    // Initial update
    updateHeight();

    // Event listeners for all browsers
    const events = ['resize', 'orientationchange'];
    events.forEach(event => {
      window.addEventListener(event, updateHeight);
    });
    
    // Visual Viewport API events for better mobile support
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);
    }

    // Address bar changes handling
    const handleViewportResize = () => {
      window.setTimeout(updateHeight, 150);
    };
    
    window.addEventListener('scroll', handleViewportResize, { passive: true });
    window.addEventListener('focus', updateHeight);
    window.addEventListener('blur', updateHeight);
    
    document.addEventListener('touchstart', handleViewportResize, { passive: true });
    document.addEventListener('touchend', handleViewportResize, { passive: true });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateHeight);
      });
      
      window.removeEventListener('scroll', handleViewportResize);
      window.removeEventListener('focus', updateHeight);
      window.removeEventListener('blur', updateHeight);
      document.removeEventListener('touchstart', handleViewportResize);
      document.removeEventListener('touchend', handleViewportResize);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
        window.visualViewport.removeEventListener('scroll', updateHeight);
      }
    };
  }, []);

  return { height, heightBreakpoint };
};