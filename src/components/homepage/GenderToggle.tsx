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
        background: 'linear-gradient(145deg, rgba(40,40,40,0.15), rgba(20,20,20,0.25))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <button
        onClick={() => handleGenderChange('Vrouw')}
        className={cn(
          "relative px-5 py-1.5 rounded-full font-header text-xs font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Vrouw'
            ? "text-gray-900"
            : "text-white/80 hover:text-white"
        )}
        style={profile.geslacht === 'Vrouw' ? {
          background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.8))'
        } : {}}
      >
        VROUW
      </button>
      <button
        onClick={() => handleGenderChange('Man')}
        className={cn(
          "relative px-5 py-1.5 rounded-full font-header text-xs font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Man'
            ? "text-gray-900"
            : "text-white/80 hover:text-white"
        )}
        style={profile.geslacht === 'Man' ? {
          background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.8))'
        } : {}}
      >
        MAN
      </button>
    </div>
  );
};