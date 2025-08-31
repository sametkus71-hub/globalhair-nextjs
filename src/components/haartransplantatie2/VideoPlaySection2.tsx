import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { Play } from 'lucide-react';
import { OptionDropdown2 } from './OptionDropdown2';
import { calculatePrice, formatPrice } from '@/lib/pricing';

export const VideoPlaySection2 = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  
  const totalPrice = calculatePrice(profile);

  return (
    <div className="w-full h-full relative bg-white">
      {/* White placeholder background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-white flex items-center justify-center">
          <p className="text-gray-400 text-sm">Placeholder</p>
        </div>
      </div>

      {/* Centered Play Button */}
      <div className="absolute inset-0 flex items-center justify-center pb-28">
        <button className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200">
          <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
        </button>
      </div>

      {/* Subtle Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-20" />

      {/* Bottom Content - positioned higher to avoid navigation overlap */}
      <div className="absolute bottom-16 left-0 right-0 z-30 px-4 pb-4">
        <div className="max-w-sm mx-auto space-y-2">
          {/* Single Pill Container with 3 Inline Dropdowns */}
          <div className="flex justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-full border border-gray-200/80 shadow-sm flex divide-x divide-gray-200/60">
              <OptionDropdown2
                options={['Nederland', 'Turkije']}
                value={profile.locatie}
                onChange={(value) => updateProfile('locatie', value)}
              />
              <OptionDropdown2
                options={['Met scheren', 'Zonder scheren']}
                value={profile.scheren}
                onChange={(value) => updateProfile('scheren', value)}
              />
              <OptionDropdown2
                options={['Normaal', 'Stamcel']}
                value={profile.behandeling}
                onChange={(value) => updateProfile('behandeling', value)}
              />
            </div>
          </div>

          {/* Cost Display with Animation */}
          <div className="text-center">
            <p 
              key={totalPrice} 
              className="text-sm font-medium text-gray-900 animate-fade-in"
            >
              Geschatte kosten: {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};