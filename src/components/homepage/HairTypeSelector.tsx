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
        background: 'linear-gradient(145deg, rgba(40,40,40,0.15), rgba(20,20,20,0.25))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {hairTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleHairTypeChange(value)}
          className={cn(
            "px-4 py-1.5 rounded-full font-header text-xs font-medium transition-all duration-300",
            profile.haartype === value
              ? "text-gray-900"
              : "text-white/80 hover:text-white"
          )}
          style={profile.haartype === value ? {
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.8))'
          } : {}}
        >
          {label}
        </button>
      ))}
    </div>
  );
};