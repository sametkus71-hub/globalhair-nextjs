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
      
      {/* Top blue blob */}
      <div 
        className="absolute w-80 h-80 opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(46, 66, 105, 0.6) 0%, rgba(46, 66, 105, 0.3) 50%, transparent 70%)',
          animation: 'top-blue-float 20s ease-in-out infinite',
          left: '20%',
          top: '10%'
        }}
      />
      
      {/* Bottom right white blob */}
      <div 
        className="absolute w-72 h-72 opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 50%, transparent 70%)',
          animation: 'white-blob-float 25s ease-in-out infinite reverse',
          right: '15%',
          bottom: '20%'
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
        
        @keyframes top-blue-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate(-15px, 20px) scale(1.1);
            opacity: 0.2;
          }
        }
        
        @keyframes white-blob-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(20px, -15px) scale(1.05);
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
};