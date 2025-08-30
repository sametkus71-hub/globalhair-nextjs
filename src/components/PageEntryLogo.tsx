import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CentralLogo } from '@/components/homepage/CentralLogo';
import { cn } from '@/lib/utils';

export const PageEntryLogo = () => {
  const location = useLocation();
  const [shouldShow, setShouldShow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Show logo entry animation for haartransplantatie and v6-hairboost pages
  const isTargetPage = location.pathname.includes('/haartransplantatie') || 
                      location.pathname.includes('/hair-transplant') || 
                      location.pathname.includes('/v6-hairboost');
  
  useEffect(() => {
    if (isTargetPage) {
      // Small delay to ensure page has loaded
      const timer = setTimeout(() => {
        setShouldShow(true);
        setIsAnimating(true);
        
        // Hide after animation completes
        const hideTimer = setTimeout(() => {
          setShouldShow(false);
          setIsAnimating(false);
        }, 600);
        
        return () => clearTimeout(hideTimer);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
      setIsAnimating(false);
    }
  }, [isTargetPage]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed z-[9998] pointer-events-none",
        // Position partially over the top grid area
        "top-[20%] left-1/2 -translate-x-1/2",
        isAnimating && "logo-entry-scale-down"
      )}
    >
      <CentralLogo />
    </div>
  );
};