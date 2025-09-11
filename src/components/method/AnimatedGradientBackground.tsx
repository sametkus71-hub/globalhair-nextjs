import { useState, useEffect } from 'react';

export const AnimatedGradientBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/7c931942-52e6-43f9-8268-058b6cd01860.png')`
        }}
      />
      
      {/* Moving overlay blob 1 */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(160, 200, 187, 0.4) 0%, transparent 70%)',
          animation: 'blob-float-1 12s ease-in-out infinite'
        }}
      />
      
      {/* Moving overlay blob 2 */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-2xl opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(201, 229, 221, 0.3) 0%, transparent 70%)',
          animation: 'blob-float-2 15s ease-in-out infinite reverse',
          right: '10%',
          bottom: '20%'
        }}
      />
      
      {/* Moving overlay blob 3 - Black breathing blob for top darkening */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-2xl opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.6) 0%, transparent 70%)',
          animation: 'blob-breathe 6s ease-in-out infinite',
          left: '60%',
          top: '10%'
        }}
      />
      
      {/* Green bottom overlay */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: `linear-gradient(to top, #8AB2A5 0%, transparent 60%)`
        }}
      />
      
      <style>{`
        @keyframes blob-float-1 {
          0%, 100% {
            transform: translate(-20px, -10px) scale(1);
          }
          25% {
            transform: translate(10px, -30px) scale(1.05);
          }
          50% {
            transform: translate(30px, 10px) scale(0.95);
          }
          75% {
            transform: translate(-10px, 20px) scale(1.02);
          }
        }
        
        @keyframes blob-float-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-25px, -15px) scale(1.08);
          }
          66% {
            transform: translate(15px, -25px) scale(0.92);
          }
        }
        
        @keyframes blob-float-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(-15px, 25px) scale(1.1) rotate(180deg);
          }
        }
        
        @keyframes blob-breathe {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate(-10px, 5px) scale(1.3);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};