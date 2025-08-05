import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  isNewPage?: boolean;
}

export const PageTransition = ({ children, isNewPage = false }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(!isNewPage);
  const [showContent, setShowContent] = useState(!isNewPage);

  useEffect(() => {
    if (isNewPage) {
      // Start with scale in animation
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
    }
  }, [isNewPage]);

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