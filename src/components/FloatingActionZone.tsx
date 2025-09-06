import React, { useState, useEffect } from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
            <Button
              key={button.id}
              size="icon"
              className={cn(
                // Size and shape
                "w-14 h-14 rounded-full",
                "sm:w-16 sm:h-16",
                
                // Styling with design system colors
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 hover:scale-110",
                "active:scale-95",
                
                // Shadow and effects
                "shadow-strong backdrop-blur-sm",
                "border-2 border-white/20",
                
                // Animation
                "transition-all duration-300 ease-out",
                
                // Initial state and entrance animation
                isVisible 
                  ? "opacity-100 translate-x-0 scale-100" 
                  : "opacity-0 translate-x-12 scale-90"
              )}
              style={{
                transitionDelay: isVisible ? `${button.delay}ms` : '0ms',
              }}
              onClick={button.onClick}
              aria-label={button.label}
            >
              <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
            </Button>
          );
        })}
      </div>

    </>
  );
};