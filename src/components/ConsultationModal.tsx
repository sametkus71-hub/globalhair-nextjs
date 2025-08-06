import React from 'react';
import { X, Calendar, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

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
      className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center sm:justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '3px solid #182F3C'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#182F3C]">
            {language === 'nl' ? 'Plan Consultatie' : 'Plan Consultation'}
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
        <div className="p-4 space-y-4">
          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 gap-3">
            <button
              className="w-full p-4 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: '#182F3C',
                color: 'white'
              }}
              onClick={() => window.open('tel:+31612345678')}
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">
                {language === 'nl' ? 'Direct bellen' : 'Call directly'}
              </span>
            </button>
            
            <button
              className="w-full p-4 rounded-xl flex items-center gap-3 border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                border: '2px solid #182F3C',
                color: '#182F3C'
              }}
              onClick={() => window.open('mailto:info@globalhair.nl')}
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">
                {language === 'nl' ? 'E-mail versturen' : 'Send email'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};