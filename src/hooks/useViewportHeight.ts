import { useState, useEffect } from 'react';

type HeightBreakpoint = 'small' | 'medium' | 'large';

export const useViewportHeight = () => {
  const [height, setHeight] = useState(0);
  const [heightBreakpoint, setHeightBreakpoint] = useState<HeightBreakpoint>('large');

  useEffect(() => {
    const updateHeight = () => {
      // Use dynamic viewport height for better mobile support
      const viewportHeight = window.innerHeight;
      setHeight(viewportHeight);
      
      // Determine breakpoint based on height
      if (viewportHeight < 700) {
        setHeightBreakpoint('small');
      } else if (viewportHeight < 850) {
        setHeightBreakpoint('medium');
      } else {
        setHeightBreakpoint('large');
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return { height, heightBreakpoint };
};