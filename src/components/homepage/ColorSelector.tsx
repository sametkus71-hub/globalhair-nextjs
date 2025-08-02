import { useSession, HairColor } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const ColorSelector = () => {
  const { profile, updateProfile } = useSession();

  const colors: { value: HairColor; image: string }[] = [
    { value: 'Blond', image: '/lovable-uploads/36464574-ba4b-4399-a478-a585122a2ec8.png' },
    { value: 'Bruin', image: '/lovable-uploads/ff5f693a-90e4-420c-bb79-6c65c660b92c.png' },
    { value: 'Zwart', image: '/lovable-uploads/923d5968-0d58-4119-bff6-65737e6f5abd.png' },
    { value: 'Rood', image: '/lovable-uploads/7783f073-22c8-4a48-86bf-433ea3f6d4da.png' },
  ];

  const handleColorChange = (color: HairColor) => {
    updateProfile('haarkleur', color);
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {colors.map(({ value, image }) => (
        <button
          key={value}
          onClick={() => handleColorChange(value)}
          className={cn(
            "w-12 h-12 rounded-full border-2 transition-all duration-300 overflow-hidden",
            "hover:scale-110 active:scale-95 shadow-lg",
            profile.haarkleur === value
              ? "border-white shadow-white/30 ring-2 ring-white/20 scale-110"
              : "border-white/30 hover:border-white/50"
          )}
        >
          <img 
            src={image} 
            alt={`${value} hair`}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
};