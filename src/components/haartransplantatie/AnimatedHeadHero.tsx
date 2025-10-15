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
      className="relative flex items-center justify-center px-4 pt-3 pb-2"
      style={{
        animation: 'fade-up 0.8s ease-out 0.2s both',
      }}
    >
      {/* Container for head and button */}
      <div className="relative">
        {/* 3D Head Image */}
        <div 
          className="relative flex items-center justify-center"
          style={{
            width: '140px',
            height: '215px',
            animation: 'fade-up 0.8s ease-out 0.3s both',
          }}
        >
          <img
            src="/assets/placeholder-head.png"
            alt="3D head model"
            className="w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(99, 179, 237, 0.4))',
            }}
          />
        </div>

        {/* Primary CTA - Analyze my hair (Bottom left of head) */}
        <label
          className="absolute bottom-2 left-0 cursor-pointer group transition-transform duration-250 hover:scale-105"
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
            className="h-12"
          />
        </label>
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
