import { useState, useEffect } from 'react';

export const AnimatedGradientBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base background color */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: '#66857B' }}
      />
      
      {/* Moving blob 1 */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(160, 200, 187, 0.5) 0%, transparent 70%)',
          animation: 'blob-float-1 14s ease-in-out infinite',
          left: '10%',
          top: '20%'
        }}
      />
      
      {/* Moving blob 2 */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-12"
        style={{
          background: 'radial-gradient(circle, rgba(201, 229, 221, 0.6) 0%, transparent 70%)',
          animation: 'blob-float-2 18s ease-in-out infinite reverse',
          right: '15%',
          bottom: '30%'
        }}
      />
      
      {/* Moving blob 3 */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-2xl opacity-8"
        style={{
          background: 'radial-gradient(circle, rgba(138, 178, 165, 0.7) 0%, transparent 70%)',
          animation: 'blob-float-3 16s ease-in-out infinite',
          left: '50%',
          top: '50%'
        }}
      />
      
      {/* Top darkening gradient with movement */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, transparent 50%)',
          animation: 'top-darken 12s ease-in-out infinite alternate'
        }}
      />
      
      {/* Bottom lightening gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(160, 200, 187, 0.3) 0%, transparent 40%)'
        }}
      />
      
      <style>{`
        @keyframes blob-float-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-15px, -10px) scale(1.05);
          }
          50% {
            transform: translate(10px, 15px) scale(0.95);
          }
          75% {
            transform: translate(-5px, -20px) scale(1.02);
          }
        }
        
        @keyframes blob-float-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -10px) scale(1.08);
          }
          66% {
            transform: translate(-10px, 20px) scale(0.92);
          }
        }
        
        @keyframes blob-float-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(15px, -15px) scale(1.1);
          }
        }
        
        @keyframes top-darken {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
};