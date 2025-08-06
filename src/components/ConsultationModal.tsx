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
      <div className="bg-background rounded-xl border border-border/20 w-full max-w-sm max-h-[85vh] overflow-y-auto" style={{
        boxShadow: 'var(--shadow-medium)'
      }}>
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">GlobalHair</p>
              <h2 className="text-lg font-semibold text-foreground">
                {language === 'nl' ? 'Consultatie' : 'Consultation'}
              </h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            {language === 'nl' 
              ? 'Premium haartransplantatie consultatie'
              : 'Premium hair transplant consultation'
            }
          </p>

          {/* Quick Contact Options */}
          <div className="space-y-2">
            <Button className="w-full justify-start gap-2 h-10" size="sm">
              <Phone className="w-4 h-4" />
              {language === 'nl' ? 'Direct bellen' : 'Call directly'}
            </Button>
            
            <Button variant="outline" className="w-full justify-start gap-2 h-10" size="sm">
              <Mail className="w-4 h-4" />
              {language === 'nl' ? 'E-mail' : 'Email'}
            </Button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">
                {language === 'nl' ? 'of formulier' : 'or form'}
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder={language === 'nl' ? 'Voornaam' : 'First name'} 
                className="h-9 text-sm"
              />
              <Input 
                placeholder={language === 'nl' ? 'Achternaam' : 'Last name'} 
                className="h-9 text-sm"
              />
            </div>
            
            <Input 
              type="email"
              placeholder={language === 'nl' ? 'E-mail' : 'Email'} 
              className="h-9 text-sm"
            />
            
            <Input 
              type="tel"
              placeholder={language === 'nl' ? 'Telefoon' : 'Phone'} 
              className="h-9 text-sm"
            />
            
            <Textarea 
              placeholder={language === 'nl' ? 'Uw situatie (optioneel)' : 'Your situation (optional)'} 
              rows={2}
              className="text-sm resize-none"
            />
            
            <Button className="w-full gap-2 h-10">
              <Calendar className="w-4 h-4" />
              {language === 'nl' ? 'Plan afspraak' : 'Schedule'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};