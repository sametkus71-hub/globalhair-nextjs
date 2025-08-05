import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  isNewPage?: boolean;
}

export const PageTransition = ({ children, isNewPage = false }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(!isNewPage);
  const [showContent, setShowContent] = useState(!isNewPage);
  const [isDirectLoad, setIsDirectLoad] = useState(false);

  useEffect(() => {
    // Check if this is a direct page load (no referrer from same origin)
    const isDirectPageLoad = !document.referrer || !document.referrer.includes(window.location.origin);
    setIsDirectLoad(isDirectPageLoad);

    if (isNewPage) {
      // For direct loads, show content immediately but with transition
      if (isDirectPageLoad) {
        setShowContent(true);
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // For navigation transitions, use the original timing
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