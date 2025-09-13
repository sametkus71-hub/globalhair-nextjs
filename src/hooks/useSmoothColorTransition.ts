import { useEffect, useRef, useCallback } from 'react';
import { HairColor } from './useSession';

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  textureFilter: string;
}

const colorThemes: Record<HairColor, ColorTheme> = {
  'Blond': {
    primary: 'hsl(47, 82%, 81%)', // Natural creamy blonde like #fbe7a1
    secondary: 'hsl(45, 75%, 75%)', // Warm blonde shadow
    accent: 'hsl(50, 85%, 85%)', // Light blonde highlight
    textureFilter: 'hue-rotate(40deg) saturate(0.6) brightness(0.75)'
  },
  'Bruin': {
    primary: 'hsl(25, 45%, 35%)',
    secondary: 'hsl(20, 40%, 30%)',
    accent: 'hsl(30, 50%, 40%)',
    textureFilter: 'hue-rotate(-10deg) saturate(0.5) brightness(0.5)'
  },
  'Zwart': {
    primary: 'hsl(220, 15%, 8%)',
    secondary: 'hsl(210, 10%, 12%)',
    accent: 'hsl(230, 20%, 6%)',
    textureFilter: 'hue-rotate(0deg) saturate(0.3) brightness(0.4)'
  },
  'Rood': {
    primary: 'hsl(0, 60%, 40%)',
    secondary: 'hsl(0, 55%, 35%)',
    accent: 'hsl(0, 65%, 45%)',
    textureFilter: 'hue-rotate(-20deg) saturate(0.8) brightness(0.6)'
  }
};

function parseHSL(hslString: string): [number, number, number] {
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return [0, 0, 0];
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

function interpolateHSL(from: [number, number, number], to: [number, number, number], progress: number): string {
  const h = Math.round(from[0] + (to[0] - from[0]) * progress);
  const s = Math.round(from[1] + (to[1] - from[1]) * progress);
  const l = Math.round(from[2] + (to[2] - from[2]) * progress);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export const useSmoothColorTransition = () => {
  const animationRef = useRef<number>();
  const currentThemeRef = useRef<ColorTheme | null>(null);
  const transitionStartRef = useRef<number>();

  const getCurrentCSSValues = useCallback((): ColorTheme => {
    const style = getComputedStyle(document.documentElement);
    return {
      primary: style.getPropertyValue('--blob-color-primary').trim() || 'hsl(220, 15%, 8%)',
      secondary: style.getPropertyValue('--blob-color-secondary').trim() || 'hsl(210, 10%, 12%)',
      accent: style.getPropertyValue('--blob-color-accent').trim() || 'hsl(230, 20%, 6%)',
      textureFilter: style.getPropertyValue('--texture-filter').trim() || 'hue-rotate(0deg) saturate(0.3) brightness(0.4)'
    };
  }, []);

  const transitionToColor = useCallback((targetColor: HairColor) => {
    const targetTheme = colorThemes[targetColor];
    const startTheme = currentThemeRef.current || getCurrentCSSValues();
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    transitionStartRef.current = performance.now();
    const duration = 10000; // 10 seconds

    const animate = (currentTime: number) => {
      const elapsed = currentTime - (transitionStartRef.current || currentTime);
      const progress = Math.min(elapsed / duration, 1);
      
      // Ultra-gentle easing curve
      const easedProgress = progress * progress * (3 - 2 * progress);

      // Interpolate colors
      const fromPrimary = parseHSL(startTheme.primary);
      const toPrimary = parseHSL(targetTheme.primary);
      const fromSecondary = parseHSL(startTheme.secondary);
      const toSecondary = parseHSL(targetTheme.secondary);
      const fromAccent = parseHSL(startTheme.accent);
      const toAccent = parseHSL(targetTheme.accent);

      const currentPrimary = interpolateHSL(fromPrimary, toPrimary, easedProgress);
      const currentSecondary = interpolateHSL(fromSecondary, toSecondary, easedProgress);
      const currentAccent = interpolateHSL(fromAccent, toAccent, easedProgress);

      // Apply interpolated colors
      document.documentElement.style.setProperty('--blob-color-primary', currentPrimary);
      document.documentElement.style.setProperty('--blob-color-secondary', currentSecondary);
      document.documentElement.style.setProperty('--blob-color-accent', currentAccent);
      document.documentElement.style.setProperty('--texture-filter', targetTheme.textureFilter);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Transition complete - update current theme, body class, and session
        currentThemeRef.current = targetTheme;
        document.body.className = document.body.className.replace(
          /\b(blond|bruin|zwart|rood)-hair\b/g, 
          ''
        );
        document.body.classList.add(`${targetColor.toLowerCase()}-hair`);
        
        // Update session storage
        const currentProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        const updatedProfile = { ...currentProfile, haarkleur: targetColor };
        sessionStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        
        // Dispatch custom event to sync with useSession
        window.dispatchEvent(new CustomEvent('profileUpdate', { 
          detail: { field: 'haarkleur', value: targetColor } 
        }));
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [getCurrentCSSValues]);

  useEffect(() => {
    // Initialize current theme
    currentThemeRef.current = getCurrentCSSValues();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [getCurrentCSSValues]);

  return { transitionToColor };
};