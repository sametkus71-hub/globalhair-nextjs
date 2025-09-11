import { useState, useEffect } from 'react';

export const AnimatedGradientBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base dark background */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: '#2A2B29',
          animation: 'subtle-breathe 8s ease-in-out infinite alternate'
        }}
      />
      
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-5"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(102, 133, 123, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(102, 133, 123, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(102, 133, 123, 0.1) 0%, transparent 50%)
          `,
          animation: 'texture-float 20s ease-in-out infinite'
        }}
      />
      
      {/* Very subtle moving texture */}
      <div 
        className="absolute w-full h-full opacity-3 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(102, 133, 123, 0.1) 0%, transparent 60%)',
          animation: 'gentle-float 25s ease-in-out infinite',
          left: '30%',
          top: '60%'
        }}
      />
      
      {/* Top darkening gradient with subtle movement */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 30%, transparent 60%)',
          animation: 'top-darken 15s ease-in-out infinite alternate'
        }}
      />
      
      {/* Bottom subtle lightening */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(102, 133, 123, 0.08) 0%, transparent 25%)'
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
      `}</style>
    </div>
  );
};