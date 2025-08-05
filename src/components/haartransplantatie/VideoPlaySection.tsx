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
      <div className="fixed bottom-16 left-0 right-0 z-30 px-4"> {/* Adjusted for smaller footer */}
        <div className="max-w-lg mx-auto space-y-6">
          {/* Option Dropdowns - iOS Style */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/30">
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <OptionDropdown
                options={['Nederland', 'Turkije']}
                value={profile.locatie}
                onChange={(value) => updateProfile('locatie', value)}
              />
              <OptionDropdown
                options={['Met scheren', 'Zonder scheren']}
                value={profile.scheren}
                onChange={(value) => updateProfile('scheren', value)}
              />
              <OptionDropdown
                options={['Normaal', 'Stamcel']}
                value={profile.behandeling}
                onChange={(value) => updateProfile('behandeling', value)}
              />
            </div>
          </div>

          {/* Cost Display */}
          <div className="text-center">
            <div className="bg-black/80 backdrop-blur-sm rounded-xl px-6 py-3 inline-block">
              <p className="text-xl font-semibold text-white">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};