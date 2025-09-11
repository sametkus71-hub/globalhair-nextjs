import { useState, useEffect } from 'react';

export const AnimatedTrajectoryBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background using uploaded image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/lovable-uploads/4ae14cdc-b900-4b5d-aaf0-c7f618222036.png)',
          animation: 'subtle-breathe 10s ease-in-out infinite alternate'
        }}
      />
      
      {/* Animated floating blob 1 - Purple/Pink */}
      <div 
        className="absolute w-96 h-96 opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%)',
          animation: 'purple-blob-float 25s ease-in-out infinite',
          left: '10%',
          top: '20%'
        }}
      />
      
      {/* Animated floating blob 2 - Blue */}
      <div 
        className="absolute w-80 h-80 opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)',
          animation: 'blue-blob-float 20s ease-in-out infinite reverse',
          right: '15%',
          top: '10%'
        }}
      />
      
      {/* Animated floating blob 3 - Teal */}
      <div 
        className="absolute w-72 h-72 opacity-18 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, rgba(20, 184, 166, 0.2) 45%, transparent 70%)',
          animation: 'teal-blob-float 22s ease-in-out infinite',
          left: '60%',
          bottom: '25%'
        }}
      />
      
      {/* Animated floating blob 4 - Pink accent */}
      <div 
        className="absolute w-64 h-64 opacity-12 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 70%)',
          animation: 'pink-blob-float 18s ease-in-out infinite reverse',
          left: '25%',
          bottom: '15%'
        }}
      />
      
      {/* Large central subtle blob */}
      <div 
        className="absolute w-[500px] h-[500px] opacity-8 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.1) 30%, transparent 60%)',
          animation: 'central-blob-float 30s ease-in-out infinite',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-6"
        style={{
          background: `
            radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(20, 184, 166, 0.05) 0%, transparent 50%)
          `,
          animation: 'texture-drift 35s ease-in-out infinite'
        }}
      />
      
      <style>{`
        @keyframes subtle-breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.005);
            opacity: 0.98;
          }
        }
        
        @keyframes purple-blob-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          33% {
            transform: translate(15px, -20px) scale(1.1);
            opacity: 0.15;
          }
          66% {
            transform: translate(-10px, 15px) scale(0.9);
            opacity: 0.25;
          }
        }
        
        @keyframes blue-blob-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translate(-20px, 25px) scale(1.2);
            opacity: 0.1;
          }
        }
        
        @keyframes teal-blob-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.18;
          }
          25% {
            transform: translate(18px, -12px) scale(1.05);
            opacity: 0.22;
          }
          75% {
            transform: translate(-15px, 20px) scale(0.95);
            opacity: 0.14;
          }
        }
        
        @keyframes pink-blob-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.12;
          }
          40% {
            transform: translate(-25px, -18px) scale(1.15);
            opacity: 0.08;
          }
          80% {
            transform: translate(20px, 12px) scale(0.85);
            opacity: 0.16;
          }
        }
        
        @keyframes central-blob-float {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.08;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.05;
          }
        }
        
        @keyframes texture-drift {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.06;
          }
          25% {
            transform: translate(8px, -5px) rotate(1deg);
            opacity: 0.04;
          }
          50% {
            transform: translate(-5px, 10px) rotate(-0.5deg);
            opacity: 0.08;
          }
          75% {
            transform: translate(12px, -8px) rotate(0.8deg);
            opacity: 0.05;
          }
        }
      `}</style>
    </div>
  );
};