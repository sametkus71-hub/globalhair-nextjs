import { useSession, HairType } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

interface HairTypeSelectorProps {
  heightBreakpoint?: 'small' | 'medium' | 'large';
}

export const HairTypeSelector = ({ heightBreakpoint = 'large' }: HairTypeSelectorProps) => {
  const { profile, updateProfile } = useSession();

  const hairTypes: { value: HairType; label: string }[] = [
    { value: 'Fijn', label: 'Fijn' },
    { value: 'Stijl', label: 'Stijl' },
    { value: 'Krul', label: 'Krul' },
    { value: 'Kroes', label: 'Kroes' },
  ];

  const handleHairTypeChange = (hairType: HairType) => {
    updateProfile('haartype', hairType);
  };

  const activeIndex = hairTypes.findIndex(h => h.value === profile.haartype);

  return (
    <div 
      className="relative inline-flex p-1 rounded-full"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      {/* Sliding background */}
      {activeIndex >= 0 && (
        <div
          className="absolute rounded-full transition-transform duration-300 ease-out"
          style={{
            width: 'calc(25% - 4px)',
            height: 'calc(100% - 8px)',
            top: '4px',
            left: '4px',
            backdropFilter: 'blur(40px)',
            background: 'rgba(255, 255, 255, 0.3)',
            transform: `translateX(${activeIndex * 25}%)`,
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}
      
      {hairTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleHairTypeChange(value)}
          className={cn(
            "relative z-10 rounded-full font-header font-medium transition-colors duration-200 flex items-center justify-center",
            heightBreakpoint === 'small' ? "px-3 py-1 text-[10px]" :
            heightBreakpoint === 'medium' ? "px-3.5 py-1.5 text-[11px]" :
            "px-4 py-1.5 text-[12px]",
            profile.haartype === value
              ? "text-white"
              : "text-white/80 hover:text-white"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};