import { Camera, Upload } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

export const AnimatedHeadHero = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: language === 'nl' ? 'Foto ontvangen' : 'Photo received',
        description: language === 'nl' 
          ? "We analyseren je haarlijn." 
          : "We'll analyze your hairline.",
      });
    }
  };

  return (
    <div 
      className="relative flex items-center justify-between px-8 pt-6 pb-4"
      style={{
        animation: 'fade-up 0.8s ease-out 0.2s both',
      }}
    >
      {/* Primary CTA - Analyze my hair (Left side) */}
      <label
        className="relative cursor-pointer group transition-transform duration-250 hover:scale-105"
        style={{
          animation: 'fade-up 0.8s ease-out 0.4s both',
        }}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <img 
          src="/assets/analyze-button.svg" 
          alt={language === 'nl' ? 'Analyseer mijn haar' : 'Analyze my hair'}
          className="h-14"
        />
      </label>

      {/* 3D Head Image (Right side) */}
      <div 
        className="relative w-72 h-72 flex items-center justify-center"
        style={{
          animation: 'fade-up 0.8s ease-out 0.3s both',
        }}
      >
        <img
          src="/assets/placeholder-head.png"
          alt="3D head model"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(99, 179, 237, 0.4))',
          }}
        />
      </div>

      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
