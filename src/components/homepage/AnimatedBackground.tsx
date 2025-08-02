import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main hair color blobs - more visible */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-[80px] opacity-30 animate-float-slow"
        style={{
          top: '-10%',
          left: '-10%',
          background: 'var(--blob-color-primary)',
        }}
      />
      
      <div 
        className="absolute w-72 h-72 rounded-full blur-[90px] opacity-25 animate-float-medium"
        style={{
          bottom: '-15%',
          left: '-8%',
          background: 'var(--blob-color-secondary)',
        }}
      />
      
      <div 
        className="absolute w-96 h-96 rounded-full blur-[70px] opacity-35 animate-float-gentle"
        style={{
          top: '40%',
          right: '-12%',
          background: 'var(--blob-color-primary)',
        }}
      />

      {/* Additional smaller blobs for busier feeling */}
      <div 
        className="absolute w-60 h-60 rounded-full blur-[100px] opacity-20 animate-float-slow"
        style={{
          top: '20%',
          left: '15%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-15s'
        }}
      />

      <div 
        className="absolute w-48 h-48 rounded-full blur-[110px] opacity-15 animate-float-medium"
        style={{
          top: '70%',
          right: '25%',
          background: 'var(--blob-color-secondary)',
          animationDelay: '-30s'
        }}
      />

      <div 
        className="absolute w-64 h-64 rounded-full blur-[95px] opacity-18 animate-float-gentle"
        style={{
          top: '10%',
          right: '40%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-45s'
        }}
      />

      <div 
        className="absolute w-52 h-52 rounded-full blur-[105px] opacity-22 animate-float-slow"
        style={{
          bottom: '30%',
          left: '40%',
          background: 'var(--blob-color-primary)',
          animationDelay: '-60s'
        }}
      />
      
    </div>
  );
};