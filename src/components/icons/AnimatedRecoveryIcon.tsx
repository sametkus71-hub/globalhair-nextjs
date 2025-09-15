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

  const recoveryElements = [
    // First recovery arrow (leftmost)
    {
      svg: (
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.53646 0.396885C1.13567 -0.533975 0 0.228597 0 2.09878V15.8999C0 17.7719 1.13567 18.5335 2.53646 17.6035L12.9491 10.6856C14.3503 9.75437 14.3503 8.24571 12.9491 7.31474L2.53646 0.396885Z" fill="white" fillOpacity="0.5"/>
        </svg>
      ),
      position: 'left-0'
    },
    // Second recovery arrow
    {
      svg: (
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.53646 0.396885C1.13567 -0.533975 0 0.228597 0 2.09878V15.8999C0 17.7719 1.13567 18.5335 2.53646 17.6035L12.9491 10.6856C14.3503 9.75437 14.3503 8.24571 12.9491 7.31474L2.53646 0.396885Z" fill="white" fillOpacity="0.75"/>
        </svg>
      ),
      position: 'left-3'
    },
    // Third recovery arrow
    {
      svg: (
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.53646 0.396885C1.13567 -0.533975 0 0.228597 0 2.09878V15.8999C0 17.7719 1.13567 18.5335 2.53646 17.6035L12.9491 10.6856C14.3503 9.75437 14.3503 8.24571 12.9491 7.31474L2.53646 0.396885Z" fill="white"/>
        </svg>
      ),
      position: 'left-6'
    }
  ];

  return (
    <div className={cn("relative w-16 h-5 flex items-center", className)}>
      {recoveryElements.map((element, index) => {
        const elementIndex = index + 1;
        const isActive = elementIndex <= level;
        const hasAnimated = elementIndex <= animationPhase;
        const isGhost = elementIndex > level;
        
        return (
          <div
            key={`recovery-${index}`}
            className={cn(
              "absolute transition-all duration-300 ease-out",
              element.position,
              isActive && hasAnimated ? "opacity-100 translate-x-0" : 
              isActive ? "opacity-0 -translate-x-2" :
              "opacity-20" // Ghost state
            )}
            style={{
              transitionDelay: `${index * 200}ms`
            }}
          >
            {element.svg}
          </div>
        );
      })}
    </div>
  );
};