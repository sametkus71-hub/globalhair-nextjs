import { useSession, HairColor } from '@/hooks/useSession';
import { useSmoothColorTransition } from '@/hooks/useSmoothColorTransition';
import { cn } from '@/lib/utils';

interface ColorSelectorProps {
  heightBreakpoint?: 'small' | 'medium' | 'large';
}

export const ColorSelector = ({ heightBreakpoint = 'large' }: ColorSelectorProps) => {
  const { profile, updateProfile } = useSession();
  const { transitionToColor } = useSmoothColorTransition();

  const colors: { value: HairColor; gradient: string; title: string }[] = [
    { 
      value: 'Blond', 
      gradient: 'linear-gradient(135deg, hsl(47, 82%, 81%) 0%, hsl(45, 75%, 75%) 50%, hsl(50, 85%, 85%) 100%)',
      title: 'Blond haar voor GlobalHair haartransplantatie behandeling'
    },
    { 
      value: 'Bruin', 
      gradient: 'linear-gradient(135deg, hsl(25, 45%, 35%) 0%, hsl(20, 40%, 30%) 50%, hsl(30, 50%, 40%) 100%)',
      title: 'Bruin haar voor GlobalHair haartransplantatie behandeling'
    },
    { 
      value: 'Zwart', 
      gradient: 'linear-gradient(135deg, hsl(220, 15%, 8%) 0%, hsl(210, 10%, 12%) 50%, hsl(230, 20%, 6%) 100%)',
      title: 'Zwart haar voor GlobalHair haartransplantatie behandeling'
    },
    { 
      value: 'Wit', 
      gradient: 'linear-gradient(135deg, hsl(0, 0%, 40%) 0%, hsl(0, 0%, 35%) 50%, hsl(0, 0%, 45%) 100%)',
      title: 'Wit grijs haar voor GlobalHair haartransplantatie behandeling'
    },
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
      {colors.map(({ value, gradient, title }) => (
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
          <div 
            className="w-full h-full"
            style={{ 
              background: gradient
            }}
            aria-label={title}
          />
        </button>
      ))}
    </div>
  );
};