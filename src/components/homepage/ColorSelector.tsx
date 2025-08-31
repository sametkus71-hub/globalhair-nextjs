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

  const colors: { value: HairColor; image: string; alt: string }[] = [
    { value: 'Blond', image: '/lovable-uploads/aca001f8-e280-494a-b8a8-028265622a3c.png', alt: 'Blond haar textuur voor GlobalHair haartransplantatie behandeling' },
    { value: 'Bruin', image: '/lovable-uploads/92fc5805-8251-412a-ae5f-da33d30a2dde.png', alt: 'Bruin haar textuur voor GlobalHair haartransplantatie behandeling' },
    { value: 'Zwart', image: '/lovable-uploads/df4923b9-9a1c-4947-af38-2c39249664a4.png', alt: 'Zwart haar textuur voor GlobalHair haartransplantatie behandeling' },
    { value: 'Wit', image: '/lovable-uploads/30181b08-9d4b-4553-98aa-04bd671930be.png', alt: 'Wit grijs haar textuur voor GlobalHair haartransplantatie behandeling' },
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
      {colors.map(({ value, image, alt }) => (
        <button
          key={value}
          onClick={() => handleColorChange(value)}
          className={cn(
            "overflow-hidden border transition-all duration-300",
            "hover:scale-110 active:scale-95 shadow-lg",
            heightBreakpoint === 'small' ? "w-5 h-5" :
            heightBreakpoint === 'medium' ? "w-6 h-6" :
            "w-7 h-7",
            profile.haarkleur === value
              ? "border-2 border-white shadow-white/20 ring-1 ring-white/15 scale-110"
              : "border-white/25 hover:border-white/40"
          )}
          style={{ 
            borderRadius: '50%'
          }}
          title={`Selecteer ${value.toLowerCase()} haar voor haartransplantatie - GlobalHair`}
        >
          <CachedImage 
            src={image} 
            alt={alt}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
};