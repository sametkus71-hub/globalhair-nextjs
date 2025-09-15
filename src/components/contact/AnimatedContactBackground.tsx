import { useState, useEffect } from 'react';

export const AnimatedContactBackground = () => {
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
      
      {/* Layer 3: Static topographic pattern overlay with gradient fade */}
      <div 
        className="absolute inset-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url('/lovable-uploads/89206142-6b0c-4e53-85bc-304567882660.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
          mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
          WebkitMask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
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
      `}</style>
    </div>
  );
};