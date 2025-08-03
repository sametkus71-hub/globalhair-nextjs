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
          backgroundColor: 'var(--blob-color-primary)',
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
          backgroundColor: 'var(--blob-color-secondary)',
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
          backgroundColor: 'var(--blob-color-accent)',
          filter: 'blur(30px)',
          animation: 'blob-float 12s ease-in-out infinite'
        }}
      />
      
    </div>
  );
};