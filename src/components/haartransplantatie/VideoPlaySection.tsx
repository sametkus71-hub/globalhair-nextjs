import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export const VideoPlaySection = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full h-full relative">
      {/* Wireframe Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 400 300" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern 
              id="grid" 
              width="20" 
              height="20" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M 20 0 L 0 0 0 20" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-white" />
          {/* Wireframe rectangles */}
          <rect x="50" y="50" width="300" height="200" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/30" />
          <rect x="70" y="70" width="100" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
          <rect x="230" y="70" width="100" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
          <rect x="70" y="180" width="260" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
        </svg>
      </div>

      {/* Centered Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg">
          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
        </button>
      </div>

      {/* Fixed Bottom Content */}
      <div className="fixed bottom-20 left-0 right-0 z-30 px-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Hair Type Selector Pills */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full border border-white/20 p-1 flex gap-1">
              <button className="px-6 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
                Fijn
              </button>
              <button className="px-6 py-2 rounded-full text-white/70 text-sm font-medium hover:bg-white/10 transition-colors">
                Stijl
              </button>
              <button className="px-6 py-2 rounded-full text-white/70 text-sm font-medium hover:bg-white/10 transition-colors">
                Krul
              </button>
            </div>
          </div>

          {/* Cost Display */}
          <div className="text-center">
            <p className="text-lg font-semibold text-white">
              Geschatte kosten: EUR 12.000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};