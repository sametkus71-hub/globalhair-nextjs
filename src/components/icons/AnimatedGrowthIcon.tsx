import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGrowthIconProps {
  level: 1 | 2 | 3;
  className?: string;
}

export const AnimatedGrowthIcon = ({ level, className }: AnimatedGrowthIconProps) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Reset animation
    setAnimationPhase(0);
    
    // Start progressive animation
    const timeouts: NodeJS.Timeout[] = [];
    
    for (let i = 1; i <= level; i++) {
      timeouts.push(setTimeout(() => {
        setAnimationPhase(i);
      }, (i - 1) * 200));
    }
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [level]);

  const getOpacityForElement = (elementIndex: number) => {
    if (elementIndex === level) return 1.0; // Last active element is always fully white
    if (elementIndex < level) {
      // Previous elements have graduated opacity
      if (level === 2) return 0.5;
      if (level === 3) return elementIndex === 1 ? 0.5 : 0.75;
    }
    return 0.2; // Ghost elements
  };

  // Base leaf SVG - single element repeated
  const baseSvg = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.1912 0.454528C16.7813 4.73101 18.0004 10.5544 13.7551 14.7997C9.90214 18.6524 5.33595 17.2279 3.01111 15.7271L13.7924 4.62673L13.1005 3.93482L1.95942 14.6961C0.44423 12.3911 -1.04093 7.77796 2.84607 3.89062C7.09132 -0.354624 12.9148 0.86437 17.1912 0.454528Z" fill="white"/>
    </svg>
  );

  const positions = ['left-0', 'left-5', 'left-10'];


  return (
    <div className={cn("relative w-16 h-5", className)}>
      {/* Render 3 leaf elements next to each other */}
      {positions.map((position, index) => {
        const elementIndex = index + 1;
        const isActive = elementIndex <= level;
        const hasAnimated = elementIndex <= animationPhase;
        const elementOpacity = getOpacityForElement(elementIndex);
        
        return (
          <div
            key={`growth-${index}`}
            className={cn(
              "absolute transition-all duration-300 ease-out",
              position,
              isActive && hasAnimated ? "translate-x-0" : 
              isActive ? "-translate-x-2" :
              ""
            )}
            style={{
              opacity: isActive && hasAnimated ? elementOpacity : 
                      isActive ? 0 :
                      elementOpacity
            }}
          >
            {baseSvg}
          </div>
        );
      })}
    </div>
  );
};