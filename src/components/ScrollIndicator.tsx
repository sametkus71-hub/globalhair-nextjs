import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollContext } from '@/contexts/ScrollContext';

export const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { currentPostIndex, totalPosts, scrollToPost } = useScrollContext();

  useEffect(() => {
    // Show indicator after 3 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Hide on scroll or user interaction
    const hideIndicator = () => setIsVisible(false);
    
    window.addEventListener('scroll', hideIndicator);
    window.addEventListener('touchstart', hideIndicator);
    window.addEventListener('wheel', hideIndicator);

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('scroll', hideIndicator);
      window.removeEventListener('touchstart', hideIndicator);
      window.removeEventListener('wheel', hideIndicator);
    };
  }, []);

  if (!isVisible || currentPostIndex >= totalPosts - 1) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
      <button
        onClick={() => scrollToPost(currentPostIndex + 1)}
        className="bg-background/80 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg hover:bg-background/90 transition-all duration-200"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-6 h-6 text-foreground" />
      </button>
    </div>
  );
};