import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedRecoveryIconProps {
  level: 1 | 2 | 3;
  className?: string;
}

export const AnimatedRecoveryIcon = ({ level, className }: AnimatedRecoveryIconProps) => {
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

  // Base play button SVG - single element repeated and stacked
  const baseSvg = (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.53646 0.396885C1.13567 -0.533975 0 0.228597 0 2.09878V15.8999C0 17.7719 1.13567 18.5335 2.53646 17.6035L12.9491 10.6856C14.3503 9.75437 14.3503 8.24571 12.9491 7.31474L2.53646 0.396885Z" fill="white"/>
    </svg>
  );

  // Positions with slight stacking offset
  const stackPositions = [
    { x: 'left-0', z: 10 },    // Bottom layer
    { x: 'left-1', z: 20 },    // Middle layer
    { x: 'left-2', z: 30 }     // Top layer (rightmost on top)
  ];

  return (
    <div className={cn("relative w-16 h-5 flex items-center", className)}>
      {/* Render 3 play buttons stacked with slight offset */}
      {stackPositions.map((position, index) => {
        const elementIndex = index + 1;
        const isActive = elementIndex <= level;
        const hasAnimated = elementIndex <= animationPhase;
        const elementOpacity = getOpacityForElement(elementIndex);
        
        return (
          <div
            key={`recovery-${index}`}
            className={cn(
              "absolute transition-all duration-300 ease-out",
              position.x,
              isActive && hasAnimated ? "translate-x-0" : 
              isActive ? "-translate-x-2" :
              ""
            )}
            style={{
              opacity: isActive && hasAnimated ? elementOpacity : 
                      isActive ? 0 :
                      elementOpacity,
              transitionDelay: `${index * 200}ms`,
              zIndex: position.z
            }}
          >
            {baseSvg}
          </div>
        );
      })}
    </div>
  );
};