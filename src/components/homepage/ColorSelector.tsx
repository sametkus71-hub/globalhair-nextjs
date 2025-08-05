import { useSession, HairColor } from '@/hooks/useSession';
import { useSmoothColorTransition } from '@/hooks/useSmoothColorTransition';
import { CachedImage } from '@/components/ImagePreloader';
import { cn } from '@/lib/utils';

interface ColorSelectorProps {
  heightBreakpoint?: 'small' | 'medium' | 'large';
}

export const ColorSelector = ({ heightBreakpoint = 'large' }: ColorSelectorProps) => {
  const { profile, updateProfile } = useSession();
  const { transitionToColor } = useSmoothColorTransition();

  const colors: { value: HairColor; image: string }[] = [
    { value: 'Blond', image: '/assets/hair-blonde.png' },
    { value: 'Bruin', image: '/assets/hair-brown.png' },
    { value: 'Zwart', image: '/assets/hair-dark.png' },
    { value: 'Wit', image: '/assets/hair-gray.png' },
  ];

  const handleColorChange = (color: HairColor) => {
    // Update UI state immediately for selection feedback
    updateProfile('haarkleur', color);
    // Start smooth color transition
    transitionToColor(color);
  };

  return (
    <div className={cn(
      "flex items-center justify-center",
      heightBreakpoint === 'small' ? "space-x-2" :
      heightBreakpoint === 'medium' ? "space-x-2.5" :
      "space-x-3"
    )}>
      {colors.map(({ value, image }) => (
        <button
          key={value}
          onClick={() => handleColorChange(value)}
          className={cn(
            "overflow-hidden border transition-all duration-300",
            "hover:scale-110 active:scale-95 shadow-lg",
            heightBreakpoint === 'small' ? "w-6 h-6" :
            heightBreakpoint === 'medium' ? "w-7 h-7" :
            "w-8 h-8",
            profile.haarkleur === value
              ? "border-white shadow-white/20 ring-1 ring-white/15 scale-110"
              : "border-white/25 hover:border-white/40"
          )}
          style={{ 
            borderRadius: '50%'
          }}
        >
          <CachedImage 
            src={image} 
            alt={`${value} hair`}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
};