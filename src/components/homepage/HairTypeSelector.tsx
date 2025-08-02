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
    <div className="inline-flex bg-white/8 backdrop-blur-md rounded-lg p-0.5 border border-white/15">
      {hairTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleHairTypeChange(value)}
          className={cn(
            "px-3 py-2 rounded-md font-header text-xs font-medium transition-all duration-300",
            profile.haartype === value
              ? "bg-white text-gray-900 shadow-md"
              : "text-white/70 hover:text-white"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};