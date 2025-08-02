import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top-left blob */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-[100px] opacity-15 animate-float-slow"
        style={{
          top: '-10%',
          left: '-10%',
          background: 'var(--blob-color-1)',
        }}
      />
      
      {/* Bottom-left blob */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-[120px] opacity-10 animate-float-medium"
        style={{
          bottom: '-15%',
          left: '-8%',
          background: 'var(--blob-color-2)',
        }}
      />
      
      {/* Middle-right blob */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-[90px] opacity-12 animate-float-gentle"
        style={{
          top: '40%',
          right: '-12%',
          background: 'var(--blob-color-3)',
        }}
      />
      
    </div>
  );
};