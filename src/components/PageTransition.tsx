import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  isNewPage?: boolean;
}

export const PageTransition = ({ children, isNewPage = false }: PageTransitionProps) => {
  // Check if this is a direct page load immediately
  const isDirectPageLoad = !document.referrer || !document.referrer.includes(window.location.origin);
  
  console.log('🔍 PageTransition Debug:', {
    isNewPage,
    isDirectPageLoad,
    referrer: document.referrer,
    currentOrigin: window.location.origin,
    pathname: window.location.pathname
  });
  
  const [isVisible, setIsVisible] = useState(!isNewPage || isDirectPageLoad);
  const [showContent, setShowContent] = useState(!isNewPage || isDirectPageLoad);
  
  console.log('🔍 PageTransition State:', { isVisible, showContent });

  useEffect(() => {
    if (isNewPage && !isDirectPageLoad) {
      // Only apply transition delays for navigation (not direct loads)
      const timer1 = setTimeout(() => {
        setShowContent(true);
      }, 50);

      const timer2 = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (isNewPage && isDirectPageLoad) {
      // For direct loads, ensure content is visible with minimal delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isNewPage, isDirectPageLoad]);

  return (
    <div 
      className={cn(
        "min-h-screen relative",
        isNewPage && !isVisible && "opacity-0 scale-98",
        isNewPage && isVisible && "page-transition-scale-in"
      )}
    >
      {showContent && children}
    </div>
  );
};