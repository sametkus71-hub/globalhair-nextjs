import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { Play } from 'lucide-react';
import { OptionDropdown } from './OptionDropdown';
import { calculatePrice, formatPrice } from '@/lib/pricing';

export const VideoPlaySection = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  
  const totalPrice = calculatePrice(profile);

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

      {/* Centered Play Button - no additional footer compensation needed */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="w-20 h-20 bg-black/20 backdrop-blur-sm border border-black/30 rounded-full flex items-center justify-center hover:bg-black/30 transition-all duration-300 hover:scale-105 shadow-lg">
          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
        </button>
      </div>

      {/* Fixed Bottom Content */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Location Pills */}
          <div className="flex justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-full border border-gray-200 p-1 flex gap-1 shadow-sm">
              {(['Nederland', 'Turkije'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => updateProfile('locatie', option)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    profile.locatie === option
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Scheren Pills */}
          <div className="flex justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-full border border-gray-200 p-1 flex gap-1 shadow-sm">
              {(['Met scheren', 'Zonder scheren'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => updateProfile('scheren', option)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    profile.scheren === option
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Behandeling Pills */}
          <div className="flex justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-full border border-gray-200 p-1 flex gap-1 shadow-sm">
              {(['Normaal', 'Stamcel'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => updateProfile('behandeling', option)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    profile.behandeling === option
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Display - Simple flat text */}
          <div className="text-center pt-2">
            <p className="text-xl font-semibold text-gray-900">
              Geschatte kosten: {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};