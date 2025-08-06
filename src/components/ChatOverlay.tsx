import React from 'react';
import { X, MessageCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

interface ChatOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({ 
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

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      language === 'nl' 
        ? 'Hallo, ik ben geïnteresseerd in informatie over haartransplantatie.'
        : 'Hello, I am interested in information about hair transplantation.'
    );
    window.open(`https://wa.me/31612345678?text=${message}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center sm:justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-t-lg sm:rounded-lg shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {language === 'nl' ? 'Chat Support' : 'Chat Support'}
          </h3>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            {language === 'nl' 
              ? 'Kies hoe u contact met ons wilt opnemen voor directe ondersteuning.'
              : 'Choose how you want to contact us for direct support.'
            }
          </p>

          <div className="space-y-3">
            <Button 
              onClick={openWhatsApp}
              className="w-full justify-between bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-between" 
              size="lg"
              onClick={() => {
                // Here you would open your live chat widget
                console.log('Open live chat');
              }}
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {language === 'nl' ? 'Live Chat' : 'Live Chat'}
              </span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              {language === 'nl' 
                ? 'Gemiddelde reactietijd: 2-5 minuten'
                : 'Average response time: 2-5 minutes'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};