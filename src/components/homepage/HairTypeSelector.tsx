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

  return (
    <div 
      className="inline-flex p-1 rounded-full"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      {hairTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleHairTypeChange(value)}
          className={cn(
            "rounded-full font-header font-medium transition-all duration-300",
            heightBreakpoint === 'small' ? "px-3 py-1 text-[10px]" :
            heightBreakpoint === 'medium' ? "px-3.5 py-1.5 text-[11px]" :
            "px-4 py-1.5 text-[12px]",
            profile.haartype === value
              ? "text-gray-900"
              : "text-white/80 hover:text-white"
          )}
          style={profile.haartype === value ? {
            backdropFilter: 'blur(40px)',
            background: 'rgba(255, 255, 255, 0.9)'
          } : {}}
        >
          {label}
        </button>
      ))}
    </div>
  );
};