import React, { useState, useEffect } from 'react';
import { Calendar, MessageCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';

interface FloatingActionZoneProps {
  className?: string;
}

export const FloatingActionZone: React.FC<FloatingActionZoneProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Show buttons after a short delay
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('[data-scroll-target="treatment-info"]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const buttons = [
    {
      id: 'consult',
      icon: Calendar,
      label: language === 'nl' ? 'Plan Consult' : 'Plan Consultation',
      onClick: () => setConsultModalOpen(true),
      delay: 0,
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: language === 'nl' ? 'Chat Support' : 'Chat Support',
      onClick: () => setChatModalOpen(true),
      delay: 100,
    },
    {
      id: 'info',
      icon: ChevronDown,
      label: language === 'nl' ? 'Meer Info' : 'More Info',
      onClick: scrollToNextSection,
      delay: 200,
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

      {/* Consultation Modal */}
      <Dialog open={consultModalOpen} onOpenChange={setConsultModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Plan uw consultatie' : 'Plan your consultation'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <p className="text-sm text-muted-foreground">
              {language === 'nl' 
                ? 'Neem contact met ons op voor een persoonlijke consultatie.'
                : 'Contact us for a personal consultation.'
              }
            </p>
            <div className="flex flex-col gap-2">
              <Button className="w-full">
                {language === 'nl' ? 'Bel ons nu' : 'Call us now'}
              </Button>
              <Button variant="outline" className="w-full">
                {language === 'nl' ? 'Plan online afspraak' : 'Schedule online appointment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Support Modal */}
      <Dialog open={chatModalOpen} onOpenChange={setChatModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'nl' ? 'Chat ondersteuning' : 'Chat support'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <p className="text-sm text-muted-foreground">
              {language === 'nl' 
                ? 'Krijg direct antwoord op uw vragen via onze chat.'
                : 'Get instant answers to your questions via our chat.'
              }
            </p>
            <div className="flex flex-col gap-2">
              <Button className="w-full">
                {language === 'nl' ? 'Start WhatsApp chat' : 'Start WhatsApp chat'}
              </Button>
              <Button variant="outline" className="w-full">
                {language === 'nl' ? 'Live chat' : 'Live chat'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};