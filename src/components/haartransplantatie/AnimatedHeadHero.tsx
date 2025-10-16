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
      className="relative flex flex-col items-center px-4 pt-3 pb-4"
      style={{
        animation: 'fade-up 0.8s ease-out 0.2s both',
      }}
    >
      {/* 3D Head Image (Top) */}
      <div 
        className="relative flex items-center justify-center mb-4"
        style={{
          width: '320px',
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

      {/* Primary CTA - Analyze my hair (Bottom) */}
      <label
        className="cursor-pointer group z-10"
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
        <button
          type="button"
          className="relative px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 179, 237, 0.9), rgba(99, 179, 237, 0.7))',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 20px rgba(99, 179, 237, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(99, 179, 237, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 179, 237, 0.3)';
          }}
        >
          <Camera className="w-5 h-5 text-white" />
          <span 
            className="text-white font-semibold text-sm"
            style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
          >
            {language === 'nl' ? 'Analyseer mijn haar' : 'Analyze my hair'}
          </span>
        </button>
      </label>

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
