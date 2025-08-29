import { useState, useEffect } from 'react';

type HeightBreakpoint = 'small' | 'medium' | 'large';

// Detect Safari browser
const isSafari = () => {
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
};

export const useViewportHeight = () => {
  const [height, setHeight] = useState(0);
  const [heightBreakpoint, setHeightBreakpoint] = useState<HeightBreakpoint>('large');

  useEffect(() => {
    const updateHeight = () => {
      let viewportHeight: number;
      
      // Enhanced Safari handling
      if (isSafari()) {
        // For Safari, use multiple fallback methods
        if (window.visualViewport) {
          viewportHeight = window.visualViewport.height;
        } else {
          // Safari-specific fallbacks
          const bodyHeight = document.body.clientHeight;
          const innerHeight = window.innerHeight;
          const screenHeight = window.screen.height;
          
          // Use the most conservative (smallest) height for Safari
          viewportHeight = Math.min(innerHeight, bodyHeight || innerHeight, screenHeight || innerHeight);
        }
      } else {
        // Standard handling for other browsers
        if (window.visualViewport) {
          viewportHeight = window.visualViewport.height;
        } else {
          viewportHeight = window.innerHeight;
        }
      }

      // Additional Safari mobile address bar handling
      const documentHeight = document.documentElement.clientHeight;
      let finalHeight = viewportHeight;
      
      if (isSafari() && documentHeight > 0) {
        finalHeight = Math.min(viewportHeight, documentHeight);
      }
      
      setHeight(finalHeight);
      
      // Set CSS custom properties for use throughout the app
      document.documentElement.style.setProperty('--app-height', `${finalHeight}px`);
      document.documentElement.style.setProperty('--safe-area-height', `${finalHeight}px`);
      
      // Debug logging for Safari (temporary)
      if (isSafari()) {
        console.log('Safari height update:', {
          visualViewport: window.visualViewport?.height,
          innerHeight: window.innerHeight,
          documentHeight,
          bodyHeight: document.body.clientHeight,
          finalHeight
        });
      }
      
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

    // Enhanced event listeners for Safari and other browsers
    const events = ['resize', 'orientationchange'];
    events.forEach(event => {
      window.addEventListener(event, updateHeight);
    });
    
    // Visual Viewport API events for better mobile support
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);
    }

    // Enhanced Safari address bar changes handling
    const handleSafariResize = () => {
      // Increased delay for Safari address bar animations
      window.setTimeout(updateHeight, 300);
    };
    
    // Additional Safari-specific viewport change detection
    let safariTimer: number;
    const safariViewportWatcher = () => {
      clearTimeout(safariTimer);
      safariTimer = window.setTimeout(updateHeight, 150);
    };
    
    // Safari-specific events
    if (isSafari()) {
      window.addEventListener('scroll', handleSafariResize, { passive: true });
      window.addEventListener('focus', updateHeight);
      window.addEventListener('blur', updateHeight);
      
      document.addEventListener('touchstart', safariViewportWatcher, { passive: true });
      document.addEventListener('touchend', safariViewportWatcher, { passive: true });
    } else {
      // Standard scroll handling for non-Safari browsers
      window.addEventListener('scroll', handleSafariResize, { passive: true });
    }

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateHeight);
      });
      
      window.removeEventListener('scroll', handleSafariResize);
      
      if (isSafari()) {
        window.removeEventListener('focus', updateHeight);
        window.removeEventListener('blur', updateHeight);
        document.removeEventListener('touchstart', safariViewportWatcher);
        document.removeEventListener('touchend', safariViewportWatcher);
      }
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
        window.visualViewport.removeEventListener('scroll', updateHeight);
      }
    };
  }, []);

  return { height, heightBreakpoint };
};