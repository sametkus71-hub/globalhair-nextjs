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
    <div className="flex items-center justify-center space-x-3">
      {hairTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleHairTypeChange(value)}
          className={cn(
            "px-6 py-3 rounded-full font-header text-sm font-medium transition-all duration-300",
            "border backdrop-blur-sm",
            profile.haartype === value
              ? "bg-primary text-primary-foreground border-primary shadow-medium scale-105"
              : "bg-background/50 text-muted-foreground border-border/50 hover:bg-muted hover:border-border hover:scale-105"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};