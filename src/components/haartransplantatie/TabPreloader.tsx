import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const TabPreloader = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Only preload if we're on a haartransplantatie page
    const isHaartransplantatiePage = 
      location.pathname.includes('/haartransplantatie') || 
      location.pathname.includes('/hair-transplant') ||
      location.pathname === '/nl' ||
      location.pathname === '/en' ||
      location.pathname === '/';
    
    if (!isHaartransplantatiePage) return;
    
    // Preload all tab components after a short delay (500ms)
    const preloadTimer = setTimeout(() => {
      // Dynamic imports to preload components
      Promise.all([
        import('@/pages/TreatmentsPage'),
        import('@/pages/HaartransplantatieReviewsPage'),
        import('@/pages/HowItWorksPage'),
        import('@/pages/HaartransplantatieMissionPage'),
        import('@/pages/HaartransplantatieContactPage'),
      ]).catch(() => {
        // Silent fail - preloading is optional
      });
    }, 500);
    
    return () => clearTimeout(preloadTimer);
  }, [location.pathname]);
  
  return null;
};
