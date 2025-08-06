import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollContext } from '@/contexts/ScrollContext';

export const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'top' | 'scrolling'>('top');
  const { currentPostIndex, totalPosts } = useScrollContext();

  useEffect(() => {
    // Show indicator after 3 seconds to let user settle in
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      
      // Stay at top for 4 seconds, then start scrolling animation
      const scrollTimer = setTimeout(() => {
        setAnimationPhase('scrolling');
      }, 4000);

      return () => clearTimeout(scrollTimer);
    }, 3000);

    // Hide after user scrolls
    const handleInteraction = () => setIsVisible(false);
    
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('wheel', handleInteraction);

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
    };
  }, []);

  // Check if we're on the last post
  const isLastPost = currentPostIndex === totalPosts - 1;
  const ArrowIcon = isLastPost ? ChevronUp : ChevronDown;

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes scrollIndicator {
          0%, 100% { transform: translateY(0px); opacity: 0.8; }
          50% { transform: translateY(12px); opacity: 1; }
        }
        @keyframes slideUpFadeInMobile {
          0% { 
            transform: translateY(20px) translateX(-50%); 
            opacity: 0; 
          }
          100% { 
            transform: translateY(0px) translateX(-50%); 
            opacity: 1; 
          }
        }
        .scroll-animation {
          animation: scrollIndicator 2.5s ease-in-out infinite;
        }
        .scroll-indicator {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        .mobile-entrance {
          animation: slideUpFadeInMobile 1.5s ease-out forwards;
        }
        .mobile-scrolling {
          animation: slideUpFadeInMobile 1.5s ease-out forwards, scrollIndicator 2.5s ease-in-out infinite 1.5s;
        }
      `}</style>

      {/* Mobile & Desktop Indicator - Perfectly centered */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
        <div className={`flex flex-col items-center transition-all duration-1000 scroll-indicator ${
          animationPhase === 'scrolling' ? 'mobile-scrolling' : 'mobile-entrance'
        }`}>
          <div className="flex flex-col">
            <ArrowIcon size={20} className="text-white/70" />
            <ArrowIcon size={20} className="text-white/70 -mt-3" />
          </div>
        </div>
      </div>
    </>
  );
};