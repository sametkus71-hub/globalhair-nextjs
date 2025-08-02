import { useSession, Gender } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const GenderToggle = () => {
  const { profile, updateProfile } = useSession();

  const handleGenderChange = (gender: Gender) => {
    updateProfile('geslacht', gender);
  };

  return (
    <div 
      className="relative inline-flex p-1 rounded-full"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <button
        onClick={() => handleGenderChange('Vrouw')}
        className={cn(
          "relative px-5 py-2 rounded-full font-header text-xs font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Vrouw'
            ? "bg-white text-gray-900"
            : "text-white/80 hover:text-white"
        )}
      >
        VROUW
      </button>
      <button
        onClick={() => handleGenderChange('Man')}
        className={cn(
          "relative px-5 py-2 rounded-full font-header text-xs font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Man'
            ? "bg-white text-gray-900"
            : "text-white/80 hover:text-white"
        )}
      >
        MAN
      </button>
    </div>
  );
};