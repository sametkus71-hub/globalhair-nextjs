import { useSession, HairColor } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const ColorSelector = () => {
  const { profile, updateProfile } = useSession();

  const colors: { value: HairColor; color: string; label: string }[] = [
    { value: 'Zwart', color: 'hsl(210, 22%, 8%)', label: 'ZWART' },
    { value: 'Bruin', color: 'hsl(25, 50%, 35%)', label: 'BRUIN' },
    { value: 'Blond', color: 'hsl(45, 60%, 70%)', label: 'BLOND' },
    { value: 'Rood', color: 'hsl(15, 70%, 45%)', label: 'ROOD' },
  ];

  const handleColorChange = (color: HairColor) => {
    updateProfile('haarkleur', color);
  };

  return (
    <div className="flex items-center justify-center space-x-6">
      {colors.map(({ value, color, label }) => (
        <div key={value} className="flex flex-col items-center space-y-2">
          <button
            onClick={() => handleColorChange(value)}
            className={cn(
              "w-12 h-12 rounded-full border-2 transition-all duration-300",
              "hover:scale-110 active:scale-95",
              profile.haarkleur === value
                ? "border-primary shadow-strong scale-110"
                : "border-white/20 hover:border-white/40"
            )}
            style={{ backgroundColor: color }}
          />
          <span className={cn(
            "text-xs font-header font-medium transition-colors duration-300",
            profile.haarkleur === value ? "text-primary" : "text-muted-foreground"
          )}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};