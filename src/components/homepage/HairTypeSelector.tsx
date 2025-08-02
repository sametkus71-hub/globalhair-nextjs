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
      className="inline-flex backdrop-blur-2xl p-0.5 rounded-full"
      style={{
        background: 'linear-gradient(145deg, rgba(30,40,50,0.8), rgba(20,30,40,0.9))',
        border: '1px solid',
        borderImage: 'linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1), rgba(255,255,255,0.4)) 1',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      {hairTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleHairTypeChange(value)}
          className={cn(
            "px-3 py-1.5 rounded-full font-header text-xs font-medium transition-all duration-300 backdrop-blur-xl",
            profile.haartype === value
              ? "text-gray-900 shadow-md"
              : "text-white/80 hover:text-white"
          )}
          style={{
            background: profile.haartype === value 
              ? 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))'
              : 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            border: profile.haartype === value ? 'none' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: profile.haartype === value 
              ? '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
              : 'inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};