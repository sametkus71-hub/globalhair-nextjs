import { useSession, HairType } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

interface HairTypeSelectorProps {
  heightBreakpoint?: 'small' | 'medium' | 'large';
}

export const HairTypeSelector = ({ heightBreakpoint = 'large' }: HairTypeSelectorProps) => {
  const { profile, updateProfile } = useSession();

  const hairTypes: { value: HairType; label: string }[] = [
    { value: 'Fijn', label: 'FIJN' },
    { value: 'Stijl', label: 'STIJL' },
    { value: 'Krul', label: 'KRUL' },
    { value: 'Kroes', label: 'KROES' },
  ];

  const handleHairTypeChange = (hairType: HairType) => {
    updateProfile('haartype', hairType);
  };

  return (
    <div 
      className="inline-flex p-0.5 rounded-full"
      style={{
        boxShadow: '-2px 6px 6.3px 0px rgba(0, 0, 0, 0.25) inset',
        border: '1px solid',
        borderImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0.27) 0%, rgba(255, 255, 255, 0.35) 100%)',
        borderImageSlice: 1,
      }}
    >
      {hairTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleHairTypeChange(value)}
          className={cn(
            "rounded-full font-header font-medium transition-all duration-300",
            heightBreakpoint === 'small' ? "px-2 py-0.5 text-[9px]" :
            heightBreakpoint === 'medium' ? "px-2.5 py-1 text-[10px]" :
            "px-3 py-1 text-[10px]",
            profile.haartype === value
              ? "text-gray-900"
              : "text-white/80 hover:text-white"
          )}
          style={profile.haartype === value ? {
            boxShadow: '5px 0px 12px 0px rgba(151, 151, 151, 1)',
            backdropFilter: 'blur(52.3px)',
            background: 'rgba(255, 255, 255, 0.9)'
          } : {}}
        >
          {label}
        </button>
      ))}
    </div>
  );
};