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
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
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
      <div 
        className={cn(
          "fixed right-4 z-50 flex flex-col gap-3",
          "bottom-20 sm:bottom-24",
          "transition-all duration-300",
          className
        )}
        style={{ 
          pointerEvents: 'none',
          paddingRight: 'env(safe-area-inset-right, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {buttons.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.id}
              size="icon"
              className={cn(
                "w-12 h-12 rounded-full backdrop-blur-sm",
                "bg-background/95 hover:bg-background text-foreground",
                "border border-border shadow-medium",
                "transition-all duration-300 transform",
                "pointer-events-auto",
                "hover:scale-110 hover:shadow-strong active:scale-95",
                // Animation classes
                isVisible 
                  ? "opacity-100 translate-x-0" 
                  : "opacity-0 translate-x-8",
                // Responsive sizing with proper touch targets
                "max-[400px]:w-11 max-[400px]:h-11",
                // Ensure minimum 44px touch target on mobile
                "min-h-[44px] min-w-[44px] max-[400px]:min-h-[40px] max-[400px]:min-w-[40px]"
              )}
              style={{
                transitionDelay: isVisible ? `${button.delay}ms` : '0ms',
              }}
              onClick={button.onClick}
              aria-label={button.label}
            >
              <Icon className="w-5 h-5 max-[400px]:w-4 max-[400px]:h-4" />
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