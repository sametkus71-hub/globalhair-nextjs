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
      className="inline-flex backdrop-blur-xl p-0.5 border border-white/20"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        borderRadius: '2px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      {hairTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleHairTypeChange(value)}
          className={cn(
            "px-3 py-2 font-header text-xs font-medium transition-all duration-300",
            profile.haartype === value
              ? "text-gray-900 shadow-md"
              : "text-white/70 hover:text-white"
          )}
          style={{
            borderRadius: '1px',
            background: profile.haartype === value 
              ? 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))'
              : 'transparent'
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};