import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Simple, visible blobs that actually work */}
      
      {/* Blob 1 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '300px',
          height: '300px',
          top: '20%',
          left: '10%',
          backgroundColor: 'rgba(100, 150, 255, 0.6)',
          filter: 'blur(40px)',
          animation: 'blob-float 8s ease-in-out infinite'
        }}
      />
      
      {/* Blob 2 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '250px',
          height: '250px',
          bottom: '25%',
          right: '15%',
          backgroundColor: 'rgba(255, 150, 100, 0.5)',
          filter: 'blur(35px)',
          animation: 'blob-float 10s ease-in-out infinite reverse'
        }}
      />
      
      {/* Blob 3 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '200px',
          height: '200px',
          top: '60%',
          left: '60%',
          backgroundColor: 'rgba(150, 255, 150, 0.4)',
          filter: 'blur(30px)',
          animation: 'blob-float 12s ease-in-out infinite'
        }}
      />
      
    </div>
  );
};