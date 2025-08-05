import { useEffect, useState } from 'react';
import { CentralLogo } from './CentralLogo';

interface LoadingPreloaderProps {
  isLoading: boolean;
  progress: number;
  onComplete: () => void;
}

export const LoadingPreloader = ({ isLoading, progress, onComplete }: LoadingPreloaderProps) => {
  const [showContent, setShowContent] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setShowContent(true);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 600); // Match fade out duration
        }, 200);
      }, 100);
    }
  }, [isLoading, onComplete]);

  if (showContent && fadeOut) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-600 ease-out opacity-0"
        style={{ background: '#111111' }}
      />
    );
  }

  if (!isLoading && showContent) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-out"
        style={{ background: '#111111' }}
      >
        <div className="relative animate-scale-in">
          <CentralLogo />
          <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white/40 to-white/80 rounded-full transition-all duration-300 ease-out"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#111111' }}
    >
      <div className="relative animate-fade-in">
        <CentralLogo />
        <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-white/20 to-white/60 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-3 text-white/60 text-xs font-mono">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};