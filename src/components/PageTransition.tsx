import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  isNewPage?: boolean;
}

export const PageTransition = ({ children, isNewPage = false }: PageTransitionProps) => {
  const isDirectPageLoad = !document.referrer || !document.referrer.includes(window.location.origin);
  
  const [isVisible, setIsVisible] = useState(!isNewPage || isDirectPageLoad);
  const [showContent, setShowContent] = useState(!isNewPage || isDirectPageLoad);

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
        
        const pageItems = document.querySelectorAll('[data-page-entry]');
        pageItems.forEach((item) => {
          if (item.classList.contains('page-entry-grid')) {
            item.classList.add('page-entry-grid-visible');
          } else {
            item.classList.add('page-entry-item-visible');
          }
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isNewPage, isDirectPageLoad]);

  return (
    <div 
      className={cn(
        "min-h-[var(--app-height)] relative",
        // Start with #E4E5E0 background for smooth transition, no scale animation
        isNewPage && !isVisible && "bg-[#E4E5E0]",
        isNewPage && isVisible && "bg-transparent transition-colors duration-300"
      )}
    >
      {showContent && children}
    </div>
  );
};