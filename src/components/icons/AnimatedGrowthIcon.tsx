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

  const growthElements = [
    // First growth element (leftmost)
    {
      svg: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.1912 0.454528C16.7813 4.73101 18.0004 10.5544 13.7551 14.7997C9.90214 18.6524 5.33595 17.2279 3.01111 15.7271L13.7924 4.62673L13.1005 3.93482L1.95942 14.6961C0.44423 12.3911 -1.04093 7.77796 2.84607 3.89062C7.09132 -0.354624 12.9148 0.86437 17.1912 0.454528Z" fill="white" fillOpacity="0.5"/>
        </svg>
      ),
      position: 'left-0'
    },
    // Second growth element
    {
      svg: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.1912 0.454528C16.7813 4.73101 18.0004 10.5544 13.7551 14.7997C9.90214 18.6524 5.33595 17.2279 3.01111 15.7271L13.7924 4.62673L13.1005 3.93482L1.95942 14.6961C0.44423 12.3911 -1.04093 7.77796 2.84607 3.89062C7.09132 -0.354624 12.9148 0.86437 17.1912 0.454528Z" fill="white" fillOpacity="0.75"/>
        </svg>
      ),
      position: 'left-5'
    },
    // Third growth element
    {
      svg: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.1912 0.454528C16.7813 4.73101 18.0004 10.5544 13.7551 14.7997C9.90214 18.6524 5.33595 17.2279 3.01111 15.7271L13.7924 4.62673L13.1005 3.93482L1.95942 14.6961C0.44423 12.3911 -1.04093 7.77796 2.84607 3.89062C7.09132 -0.354624 12.9148 0.86437 17.1912 0.454528Z" fill="white"/>
        </svg>
      ),
      position: 'left-10'
    }
  ];

  const stemElements = [
    // First stem
    {
      svg: (
        <svg width="2" height="6" viewBox="0 0 2 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="1.86916" height="5.19211" rx="0.934579" fill="white" fillOpacity="0.5"/>
        </svg>
      ),
      position: 'left-4 top-3'
    },
    // Second stem
    {
      svg: (
        <svg width="2" height="6" viewBox="0 0 2 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="1.86916" height="5.19211" rx="0.934579" fill="white" fillOpacity="0.75"/>
        </svg>
      ),
      position: 'left-9 top-3'
    },
    // Third stem
    {
      svg: (
        <svg width="2" height="6" viewBox="0 0 2 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="1.86916" height="5.19211" rx="0.934579" fill="white"/>
        </svg>
      ),
      position: 'left-14 top-3'
    }
  ];

  return (
    <div className={cn("relative w-16 h-5", className)}>
      {/* Growth elements */}
      {growthElements.map((element, index) => {
        const elementIndex = index + 1;
        const isActive = elementIndex <= level;
        const hasAnimated = elementIndex <= animationPhase;
        const isGhost = elementIndex > level;
        
        return (
          <div
            key={`growth-${index}`}
            className={cn(
              "absolute transition-all duration-300 ease-out",
              element.position,
              isActive && hasAnimated ? "opacity-100 translate-x-0" : 
              isActive ? "opacity-0 -translate-x-2" :
              "opacity-20" // Ghost state
            )}
          >
            {element.svg}
          </div>
        );
      })}
      
      {/* Stem elements - only show if we have level 2 or 3 */}
      {(level >= 2 || animationPhase >= 2) && stemElements.map((element, index) => {
        const elementIndex = index + 1;
        const isActive = elementIndex < level; // Stems appear one less than growth level
        const hasAnimated = elementIndex < animationPhase;
        const isGhost = elementIndex >= level;
        
        return (
          <div
            key={`stem-${index}`}
            className={cn(
              "absolute transition-all duration-300 ease-out",
              element.position,
              isActive && hasAnimated ? "opacity-100 translate-x-0" : 
              isActive ? "opacity-0 -translate-x-1" :
              "opacity-20" // Ghost state
            )}
            style={{
              transitionDelay: `${(elementIndex) * 200}ms`
            }}
          >
            {element.svg}
          </div>
        );
      })}
    </div>
  );
};