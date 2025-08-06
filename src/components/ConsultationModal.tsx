import React from 'react';
import { X, Calendar, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { language } = useLanguage();

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{
        boxShadow: 'var(--shadow-strong)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <p className="text-sm text-muted-foreground font-medium tracking-wide">GlobalHair</p>
            <h2 className="text-xl font-semibold text-foreground">
              {language === 'nl' ? 'Plan uw consultatie' : 'Plan your consultation'}
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {language === 'nl' 
              ? 'Ervaar onze premium haartransplantatie service. Vul uw gegevens in voor een persoonlijke consultatie met onze specialists.'
              : 'Experience our premium hair transplant service. Fill in your details for a personal consultation with our specialists.'
            }
          </p>

          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 gap-3">
            <Button className="w-full justify-start gap-3" size="lg">
              <Phone className="w-5 h-5" />
              {language === 'nl' ? 'Direct bellen' : 'Call directly'}
            </Button>
            
            <Button variant="outline" className="w-full justify-start gap-3" size="lg">
              <Mail className="w-5 h-5" />
              {language === 'nl' ? 'E-mail versturen' : 'Send email'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {language === 'nl' ? 'Of vul formulier in' : 'Or fill form'}
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input 
                placeholder={language === 'nl' ? 'Voornaam' : 'First name'} 
              />
              <Input 
                placeholder={language === 'nl' ? 'Achternaam' : 'Last name'} 
              />
            </div>
            
            <Input 
              type="email"
              placeholder={language === 'nl' ? 'E-mailadres' : 'Email address'} 
            />
            
            <Input 
              type="tel"
              placeholder={language === 'nl' ? 'Telefoonnummer' : 'Phone number'} 
            />
            
            <Textarea 
              placeholder={language === 'nl' ? 'Beschrijf uw situatie (optioneel)' : 'Describe your situation (optional)'} 
              rows={3}
            />
            
            <Button className="w-full gap-2" size="lg">
              <Calendar className="w-5 h-5" />
              {language === 'nl' ? 'Afspraak inplannen' : 'Schedule appointment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};