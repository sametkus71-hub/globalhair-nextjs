import React, { useState, useEffect } from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassSurface from '@/components/ui/GlassSurface';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface FloatingActionZoneProps {
  className?: string;
}

export const FloatingActionZone: React.FC<FloatingActionZoneProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Show buttons after a short delay
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const buttons = [
    {
      id: 'info',
      icon: Calendar,
      label: language === 'nl' ? 'Info' : 'Info',
      onClick: () => navigate(language === 'nl' ? '/nl/info' : '/en/info'),
      delay: 0,
    },
    {
      id: 'support',
      icon: MessageCircle,
      label: language === 'nl' ? 'Support' : 'Support',
      onClick: () => navigate(language === 'nl' ? '/nl/support' : '/en/support'),
      delay: 100,
    },
  ];

  return (
    <>
      {/* Floating Action Buttons - Simple positioning */}
      <div 
        className={cn(
          "fixed z-50 flex flex-col gap-4",
          "right-4 bottom-24",
          "sm:right-6 sm:bottom-28",
          className
        )}
      >
        {buttons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <GlassSurface
              key={button.id}
              width={window.innerWidth >= 640 ? 64 : 56}
              height={window.innerWidth >= 640 ? 64 : 56}
              borderRadius={window.innerWidth >= 640 ? 32 : 28}
              brightness={60}
              opacity={0.8}
              blur={12}
              backgroundOpacity={0.3}
              displace={5}
              distortionScale={-150}
              redOffset={5}
              greenOffset={10}
              blueOffset={15}
              className={cn(
                "transition-all duration-300 ease-out",
                isVisible 
                  ? "opacity-100 translate-x-0 scale-100" 
                  : "opacity-0 translate-x-12 scale-90"
              )}
              style={{
                transitionDelay: isVisible ? `${button.delay}ms` : '0ms',
              }}
            >
              <button
                onClick={button.onClick}
                aria-label={button.label}
                className="w-full h-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200"
              >
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </button>
            </GlassSurface>
          );
        })}
      </div>

    </>
  );
};