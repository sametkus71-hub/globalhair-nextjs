import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export const VideoPlaySection = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full h-full relative bg-white">
      {/* White placeholder background with subtle pattern */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-gray-300 text-center">
            <div className="w-32 h-20 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <span className="text-sm font-medium">VIDEO</span>
            </div>
            <p className="text-xs text-gray-400">Placeholder</p>
          </div>
        </div>
      </div>

      {/* Centered Play Button with footer compensation */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingBottom: '60px' }} // Adjusted for smaller footer
      >
        <button className="w-20 h-20 bg-black/20 backdrop-blur-sm border border-black/30 rounded-full flex items-center justify-center hover:bg-black/30 transition-all duration-300 hover:scale-105 shadow-lg">
          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
        </button>
      </div>

      {/* Fixed Bottom Content */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-6"> {/* Adjusted for smaller footer */}
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