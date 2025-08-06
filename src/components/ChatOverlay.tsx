import React from 'react';
import { X, MessageCircle, ExternalLink, Instagram, Camera, Scan } from 'lucide-react';
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
      <div className="bg-background rounded-t-xl sm:rounded-xl border border-border/20 w-full max-w-sm" style={{
        boxShadow: 'var(--shadow-medium)'
      }}>
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">GlobalHair</p>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {language === 'nl' ? 'Contact' : 'Contact'}
              </h3>
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
        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            {language === 'nl' 
              ? 'Kies uw contact methode'
              : 'Choose your contact method'
            }
          </p>

          <div className="space-y-2">
            <Button 
              onClick={openWhatsApp}
              className="w-full justify-start gap-2 h-10 bg-primary hover:bg-primary/90"
              size="sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 h-10" 
              size="sm"
              onClick={() => window.open('https://instagram.com/globalhair', '_blank')}
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 h-10" 
              size="sm"
              onClick={() => window.open('https://tiktok.com/@globalhair', '_blank')}
            >
              <Camera className="w-4 h-4" />
              TikTok
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  {language === 'nl' ? 'of probeer' : 'or try'}
                </span>
              </div>
            </div>

            <Button 
              variant="secondary"
              className="w-full justify-start gap-2 h-10" 
              size="sm"
              onClick={() => {
                console.log('Navigate to hair scan');
              }}
            >
              <Scan className="w-4 h-4" />
              {language === 'nl' ? 'Haarscan' : 'Hair scan'}
            </Button>
          </div>

          <div className="pt-1 text-center">
            <p className="text-xs text-muted-foreground">
              {language === 'nl' 
                ? 'Reactie binnen 2-5 minuten'
                : 'Response in 2-5 minutes'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};