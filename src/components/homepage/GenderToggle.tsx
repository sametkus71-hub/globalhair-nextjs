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
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <button
        onClick={() => handleGenderChange('Man')}
        className={cn(
          "relative px-4 py-1.5 rounded-full font-header text-[12px] font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Man'
            ? "text-white glass-shine"
            : "text-white/80 hover:text-white"
        )}
        style={profile.geslacht === 'Man' ? {
          backdropFilter: 'blur(40px)',
          background: 'rgba(255, 255, 255, 0.3)'
        } : {}}
      >
        Man
      </button>
      <button
        onClick={() => handleGenderChange('Vrouw')}
        className={cn(
          "relative px-4 py-1.5 rounded-full font-header text-[12px] font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Vrouw'
            ? "text-white glass-shine"
            : "text-white/80 hover:text-white"
        )}
        style={profile.geslacht === 'Vrouw' ? {
          backdropFilter: 'blur(40px)',
          background: 'rgba(255, 255, 255, 0.3)'
        } : {}}
      >
        Vrouw
      </button>
    </div>
  );
};