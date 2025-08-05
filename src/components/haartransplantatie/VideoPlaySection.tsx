import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { Play } from 'lucide-react';
import { OptionDropdown } from './OptionDropdown';
import { calculatePrice, formatPrice } from '@/lib/pricing';

interface VideoPlaySectionProps {
  heightBreakpoint: 'small' | 'medium' | 'large';
}

export const VideoPlaySection = ({ heightBreakpoint }: VideoPlaySectionProps) => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();

  return (
    <div className="w-full h-full relative bg-white">
      {/* White placeholder background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-white flex items-center justify-center">
          <p className="text-gray-400 text-sm">Placeholder</p>
        </div>
      </div>

      {/* Centered Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200">
          <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
        </button>
      </div>

      {/* Bottom sticky controls - positioned with dynamic spacing */}
      <div 
        className="absolute left-0 right-0 z-20 px-4"
        style={{ 
          bottom: `calc(var(--bottom-nav-height, 60px) + ${heightBreakpoint === 'small' ? '12px' : '20px'})`
        }}
      >
        <div className="max-w-md mx-auto">
          {/* White container with rounded design */}
          <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
            <div className="flex items-center justify-center gap-0">
              <OptionDropdown
                options={['Nederland', 'Turkije', 'Hongarije']}
                value={profile.locatie}
                onChange={(value) => updateProfile('locatie', value)}
                size={heightBreakpoint === 'small' ? 'small' : 'medium'}
              />
              <OptionDropdown
                options={['Geschoren', 'Ongeschoren']}
                value={profile.scheren}
                onChange={(value) => updateProfile('scheren', value)}
                size={heightBreakpoint === 'small' ? 'small' : 'medium'}
              />
              <OptionDropdown
                options={['FUE', 'DHI', 'Sapphire']}
                value={profile.behandeling}
                onChange={(value) => updateProfile('behandeling', value)}
                size={heightBreakpoint === 'small' ? 'small' : 'medium'}
              />
            </div>
          </div>
          
          {/* Price display - positioned below the controls */}
          <div className="text-center mt-3">
            <p className={`text-black font-bold font-header ${heightBreakpoint === 'small' ? 'text-base' : 'text-lg'}`}>
              {formatPrice(calculatePrice(profile))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};