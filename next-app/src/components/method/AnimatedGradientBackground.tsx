'use client';

import { useState, useEffect } from 'react';

export const AnimatedGradientBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden z-0">
      {/* Base dark to green gradient background */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(to bottom, #2A2B29 0%, #3A3B35 30%, #5A615A 60%, #74998E 100%)',
          animation: 'subtle-breathe 8s ease-in-out infinite alternate'
        }}
      />
      
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-8"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(116, 153, 142, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(116, 153, 142, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(116, 153, 142, 0.05) 0%, transparent 50%)
          `,
          animation: 'texture-float 20s ease-in-out infinite'
        }}
      />
      
      {/* Very subtle moving texture */}
      <div 
        className="absolute w-full h-full opacity-6 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(116, 153, 142, 0.2) 0%, transparent 60%)',
          animation: 'gentle-float 25s ease-in-out infinite',
          left: '30%',
          top: '60%'
        }}
      />
      
      {/* Bottom right green/teal blob */}
      <div 
        className="absolute w-80 h-80 opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(116, 153, 142, 0.6) 0%, rgba(134, 173, 162, 0.4) 40%, transparent 70%)',
          animation: 'bottom-green-float 22s ease-in-out infinite',
          right: '5%',
          bottom: '10%'
        }}
      />
      
      {/* Additional #66857B color enhancement */}
      <div 
        className="absolute w-96 h-96 opacity-12 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(102, 133, 123, 0.5) 0%, rgba(102, 133, 123, 0.2) 50%, transparent 70%)',
          animation: 'mid-green-float 18s ease-in-out infinite reverse',
          left: '15%',
          bottom: '20%'
        }}
      />
      
      {/* Top darkening gradient with subtle movement */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 30%, transparent 60%)',
          animation: 'top-darken 15s ease-in-out infinite alternate'
        }}
      />
      
      {/* Bottom green enhancement with #66857B */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(102, 133, 123, 0.25) 0%, rgba(116, 153, 142, 0.15) 30%, rgba(116, 153, 142, 0.08) 50%, transparent 70%)'
        }}
      />
      
      <style>{`
        @keyframes subtle-breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.002);
            opacity: 0.98;
          }
        }
        
        @keyframes texture-float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.05;
          }
          33% {
            transform: translate(5px, -3px) rotate(0.5deg);
            opacity: 0.03;
          }
          66% {
            transform: translate(-3px, 5px) rotate(-0.3deg);
            opacity: 0.07;
          }
        }
        
        @keyframes gentle-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(8px, -5px) scale(1.02);
          }
        }
        
        @keyframes top-darken {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-2px);
            opacity: 0.95;
          }
        }
        
        @keyframes bottom-green-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.15;
          }
          33% {
            transform: translate(-10px, -8px) scale(1.05);
            opacity: 0.12;
          }
          66% {
            transform: translate(8px, 6px) scale(0.98);
            opacity: 0.18;
          }
        }
        
        @keyframes mid-green-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.12;
          }
          50% {
            transform: translate(12px, -10px) scale(1.08);
            opacity: 0.08;
          }
        }
      `}</style>
    </div>
  );
};