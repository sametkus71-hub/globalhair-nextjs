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
      className="relative flex items-center justify-between px-8 h-[60vh]"
      style={{
        animation: 'fade-up 0.8s ease-out 0.2s both',
      }}
    >
      {/* Primary CTA - Analyze my hair (Left side) */}
      <label
        className="relative cursor-pointer group"
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
        <div
          className="flex items-center space-x-4 px-10 py-5 rounded-full transition-all duration-250"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span 
            className="text-white font-medium text-2xl"
            style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
          >
            {language === 'nl' ? 'Analyseer mijn haar' : 'Analyze my hair'}
          </span>
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Camera className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </label>

      {/* 3D Head Video (Right side) */}
      <div 
        className="relative w-96 h-96"
        style={{
          animation: 'fade-up 0.8s ease-out 0.3s both',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(99, 179, 237, 0.4))',
          }}
        >
          <source src="/assets/head-rotation.mp4" type="video/mp4" />
        </video>
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
