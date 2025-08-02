import { useSession, Gender } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const GenderToggle = () => {
  const { profile, updateProfile } = useSession();

  const handleGenderChange = (gender: Gender) => {
    updateProfile('geslacht', gender);
  };

  return (
    <div 
      className="relative inline-flex backdrop-blur-xl p-0.5 border border-white/20"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        borderRadius: '2px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      <button
        onClick={() => handleGenderChange('Vrouw')}
        className={cn(
          "relative px-4 py-2 font-header text-xs font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Vrouw'
            ? "text-gray-900 shadow-md"
            : "text-white/70 hover:text-white"
        )}
        style={{
          borderRadius: '1px',
          background: profile.geslacht === 'Vrouw' 
            ? 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))'
            : 'transparent'
        }}
      >
        VROUW
      </button>
      <button
        onClick={() => handleGenderChange('Man')}
        className={cn(
          "relative px-4 py-2 font-header text-xs font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Man'
            ? "text-gray-900 shadow-md"
            : "text-white/70 hover:text-white"
        )}
        style={{
          borderRadius: '1px',
          background: profile.geslacht === 'Man' 
            ? 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))'
            : 'transparent'
        }}
      >
        MAN
      </button>
    </div>
  );
};