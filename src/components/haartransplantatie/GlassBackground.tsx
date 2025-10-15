import { useEffect, useState } from 'react';

export const GlassBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden z-0">
      {/* Base dark blue gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(to bottom, #0e2030 0%, #0a1623 100%)',
        }}
      />
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Soft light streaks */}
      <div 
        className="absolute w-full h-full opacity-20"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(99, 179, 237, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)
          `,
          animation: 'gentle-float 25s ease-in-out infinite'
        }}
      />
      
      {/* Depth layer */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />
      
      <style>{`
        @keyframes gentle-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(10px, -10px) scale(1.05);
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
};
