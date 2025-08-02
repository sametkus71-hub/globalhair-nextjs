import { useSession, HairType } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const HairTypeSelector = () => {
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
      className="inline-flex p-1 rounded-full"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {hairTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleHairTypeChange(value)}
          className={cn(
            "px-4 py-2 rounded-full font-header text-xs font-medium transition-all duration-300",
            profile.haartype === value
              ? "bg-white text-gray-900"
              : "text-white/80 hover:text-white"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};