import { useState, useEffect } from 'react';

export const AnimatedGradientBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient layer */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at bottom left, #A0C8BB 0%, transparent 50%),
                       radial-gradient(ellipse at bottom right, #C9E5DD 0%, transparent 50%),
                       linear-gradient(to bottom, #32322E 0%, #32322E 40%, transparent 100%)`
        }}
      />
      
      {/* First animated layer */}
      <div 
        className="absolute inset-0 animate-pulse"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 30% 100%, rgba(160, 200, 187, 0.3) 0%, transparent 50%),
                       radial-gradient(ellipse 100% 60% at 70% 100%, rgba(201, 229, 221, 0.2) 0%, transparent 50%)`,
          animationDuration: '8s',
          animationTimingFunction: 'ease-in-out'
        }}
      />
      
      {/* Second animated layer with slower timing */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 150% 100% at 20% 90%, rgba(160, 200, 187, 0.2) 0%, transparent 60%),
                       radial-gradient(ellipse 130% 80% at 80% 90%, rgba(201, 229, 221, 0.15) 0%, transparent 60%)`,
          animation: 'gradient-shift 12s ease-in-out infinite alternate'
        }}
      />
      
      {/* Third layer for subtle movement */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, transparent 0%, rgba(50, 50, 46, 0.1) 30%, transparent 70%)`,
          animation: 'gentle-sway 15s ease-in-out infinite alternate'
        }}
      />
      
      <style>{`
        @keyframes gradient-shift {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-10px, -5px) scale(1.02);
            opacity: 0.8;
          }
          100% {
            transform: translate(5px, -2px) scale(0.98);
            opacity: 0.7;
          }
        }
        
        @keyframes gentle-sway {
          0% {
            transform: rotate(0deg) translate(0, 0);
          }
          50% {
            transform: rotate(0.5deg) translate(-2px, -1px);
          }
          100% {
            transform: rotate(-0.3deg) translate(1px, -2px);
          }
        }
      `}</style>
    </div>
  );
};