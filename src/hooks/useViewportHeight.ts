import { useState, useEffect } from 'react';

type HeightBreakpoint = 'small' | 'medium' | 'large';

export const useViewportHeight = () => {
  const [height, setHeight] = useState(0);
  const [heightBreakpoint, setHeightBreakpoint] = useState<HeightBreakpoint>('large');

  useEffect(() => {
    const updateHeight = () => {
      let viewportHeight: number;
      
      // Use Visual Viewport API when available (better for mobile)
      if (window.visualViewport) {
        viewportHeight = window.visualViewport.height;
      } else {
        // Fallback to window.innerHeight
        viewportHeight = window.innerHeight;
      }

      // For Safari mobile, account for address bar by using the smaller value
      const documentHeight = document.documentElement.clientHeight;
      const finalHeight = Math.min(viewportHeight, documentHeight);
      
      setHeight(finalHeight);
      
      // Set CSS custom properties for use throughout the app
      document.documentElement.style.setProperty('--app-height', `${finalHeight}px`);
      document.documentElement.style.setProperty('--safe-area-height', `${finalHeight}px`);
      
      // Determine breakpoint based on height
      if (finalHeight < 700) {
        setHeightBreakpoint('small');
      } else if (finalHeight < 850) {
        setHeightBreakpoint('medium');
      } else {
        setHeightBreakpoint('large');
      }
    };

    // Initial update
    updateHeight();

    // Listen to various viewport change events
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    
    // Visual Viewport API events for better mobile support
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);
    }

    // Handle Safari address bar changes with a delay
    const handleSafariResize = () => {
      setTimeout(updateHeight, 100);
    };
    window.addEventListener('scroll', handleSafariResize, { passive: true });

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
      window.removeEventListener('scroll', handleSafariResize);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
        window.visualViewport.removeEventListener('scroll', updateHeight);
      }
    };
  }, []);

  return { height, heightBreakpoint };
};