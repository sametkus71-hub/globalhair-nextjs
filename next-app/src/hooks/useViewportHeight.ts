import { useState, useEffect } from 'react';

type HeightBreakpoint = 'small' | 'medium' | 'large';

const getBreakpoint = (height: number): HeightBreakpoint => {
  if (height < 700) return 'small';
  if (height < 850) return 'medium';
  return 'large';
};

const applyHeight = (height: number) => {
  document.documentElement.style.setProperty('--app-height', `${height}px`);
  document.documentElement.style.setProperty('--safe-area-height', `${height}px`);
};

export const useViewportHeight = () => {
  const [height, setHeight] = useState(0);
  const [heightBreakpoint, setHeightBreakpoint] = useState<HeightBreakpoint>('large');

  useEffect(() => {
    // Fresh detection on every page load
    const detectHeight = () => {
      // Use window.innerHeight as it's more stable than visualViewport logic for initial layout
      // But for keyboard stability, we might want visualViewport.
      // User requested visualViewport logic.
      const freshHeight = window.visualViewport?.height || window.innerHeight;

      setHeight(freshHeight);
      setHeightBreakpoint(getBreakpoint(freshHeight));
      applyHeight(freshHeight);
    };

    // Initialize immediately
    detectHeight();

    // Handle orientation changes and resize
    // Note: visualViewport resize event handles keyboard open/close
    // But we might NOT want to resize the --app-height when keyboard opens if we want the BG to stay stable (covered)
    // Actually, usually you WANT the app height to shrink so inputs are visible, BUT the BG video should maybe stay fixed.
    // User says "bg video moves up... unusable". 
    // If we use fixed app-height calculated ONCE (or on orientation), and ignore keyboard resize, the BG will stay 100% of physical screen.
    // The user's snippet ADDS listeners. 

    const handleResize = () => {
      // Only update if the change is significant (orientation) or not keyboard (keyboard shrinks height significantly)
      // If we want to FIX the background, we should use window.innerHeight which usually ignores keyboard in some browsers, or capture initial height.

      // HOWEVER, the user specifically asked for "visualViewport" approach.
      // Let's stick to their requested logic first.
      detectHeight();
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => setTimeout(detectHeight, 100));

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', detectHeight);
    };
  }, []);

  return { height, heightBreakpoint };
};