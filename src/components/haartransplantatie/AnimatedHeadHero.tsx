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
      className="relative flex flex-col items-center pt-20 pb-8"
      style={{
        animation: 'fade-up 0.8s ease-out 0.2s both',
      }}
    >
      {/* 3D Head Visual */}
      <div 
        className="relative w-64 h-64 mb-8"
        style={{
          animation: 'slow-rotate 16s linear infinite',
        }}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(99, 179, 237, 0.3) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)',
            backdropFilter: 'blur(40px)',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(255, 255, 255, 0.05)',
          }}
        />
        
        {/* Placeholder for head - will be replaced with actual 3D model/video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="text-8xl opacity-30"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(99, 179, 237, 0.3))',
            }}
          >
            👤
          </div>
        </div>
      </div>

      {/* Primary CTA - Analyze my hair */}
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
          className="flex items-center space-x-3 px-8 py-4 rounded-full transition-all duration-250"
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
          <Camera className="w-6 h-6 text-white" strokeWidth={1.5} />
          <span 
            className="text-white font-medium text-lg"
            style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
          >
            {language === 'nl' ? 'Analyseer mijn haar' : 'Analyze my hair'}
          </span>
        </div>
      </label>

      {/* Secondary upload button */}
      <label
        className="absolute top-24 right-8 cursor-pointer"
        style={{
          animation: 'fade-in 0.8s ease-out 0.6s both',
        }}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Upload className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
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
        
        @keyframes slow-rotate {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
};
