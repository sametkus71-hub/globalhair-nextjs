import { useSession, HairColor } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const ColorSelector = () => {
  const { profile, updateProfile } = useSession();

  const colors: { value: HairColor; color: string }[] = [
    { value: 'Blond', color: '#D4A574' },
    { value: 'Bruin', color: '#8B7355' },
    { value: 'Zwart', color: '#2B2B2B' },
    { value: 'Rood', color: '#A0522D' },
  ];

  const handleColorChange = (color: HairColor) => {
    updateProfile('haarkleur', color);
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {colors.map(({ value, color }) => (
        <button
          key={value}
          onClick={() => handleColorChange(value)}
          className={cn(
            "w-12 h-12 rounded-full border-2 transition-all duration-300",
            "hover:scale-110 active:scale-95 shadow-lg",
            profile.haarkleur === value
              ? "border-white shadow-white/30 ring-2 ring-white/20 scale-110"
              : "border-white/30 hover:border-white/50"
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};