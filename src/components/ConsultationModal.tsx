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
      className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center sm:justify-center p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '3px solid #182F3C'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#182F3C]">
            {language === 'nl' ? 'Plan consult' : 'Plan consultation'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600">
            {language === 'nl' 
              ? 'Vul uw gegevens in voor een persoonlijke consultatie over haartransplantatie.'
              : 'Fill in your details for a personal hair transplant consultation.'
            }
          </p>

          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 gap-3">
            <Button 
              className="w-full justify-start gap-3 h-12"
              style={{
                backgroundColor: '#182F3C',
                color: 'white'
              }}
              onClick={() => window.open('tel:+31612345678')}
            >
              <Phone className="w-5 h-5" />
              {language === 'nl' ? 'Direct bellen' : 'Call directly'}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12 border-2"
              style={{
                borderColor: '#182F3C',
                color: '#182F3C'
              }}
              onClick={() => window.open('mailto:info@globalhair.nl')}
            >
              <Mail className="w-5 h-5" />
              {language === 'nl' ? 'E-mail versturen' : 'Send email'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                {language === 'nl' ? 'Of vul formulier in' : 'Or fill form'}
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input 
                placeholder={language === 'nl' ? 'Voornaam' : 'First name'} 
                className="border-gray-200 focus:border-[#182F3C]"
              />
              <Input 
                placeholder={language === 'nl' ? 'Achternaam' : 'Last name'} 
                className="border-gray-200 focus:border-[#182F3C]"
              />
            </div>
            
            <Input 
              type="email"
              placeholder={language === 'nl' ? 'E-mailadres' : 'Email address'} 
              className="border-gray-200 focus:border-[#182F3C]"
            />
            
            <Input 
              type="tel"
              placeholder={language === 'nl' ? 'Telefoonnummer' : 'Phone number'} 
              className="border-gray-200 focus:border-[#182F3C]"
            />
            
            <Textarea 
              placeholder={language === 'nl' ? 'Beschrijf uw situatie (optioneel)' : 'Describe your situation (optional)'} 
              rows={3}
              className="border-gray-200 focus:border-[#182F3C]"
            />
            
            <Button 
              className="w-full gap-2 h-12"
              style={{
                backgroundColor: '#182F3C',
                color: 'white'
              }}
            >
              <Calendar className="w-5 h-5" />
              {language === 'nl' ? 'Afspraak inplannen' : 'Schedule appointment'}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-3">
              {language === 'nl' 
                ? 'We nemen binnen 24 uur contact met u op om de afspraak in te plannen.'
                : 'We will contact you within 24 hours to schedule your appointment.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};