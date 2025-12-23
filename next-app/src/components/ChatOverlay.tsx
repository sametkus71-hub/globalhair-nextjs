'use client';

import React from 'react';
import { X, MessageCircle, Instagram, ExternalLink, Scan } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

interface ChatOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatOverlay: React.FC<ChatOverlayProps & {
  children?: React.ReactNode;
}> = ({
  open,
  onOpenChange,
  children
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
      window.open(`https://wa.me/31633388757?text=${message}`, '_blank');
    };

    const openInstagram = () => {
      window.open('https://instagram.com/globalhair', '_blank');
    };

    const openTikTok = () => {
      window.open('https://tiktok.com/@globalhair', '_blank');
    };

    const openHairScan = () => {
      // Navigate to hair scan page or open modal
      console.log('Open hair scan');
    };

    return (
      <div
        className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center sm:justify-center p-0 sm:p-4"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm max-h-[85vh] overflow-y-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '3px solid #182F3C'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-[#182F3C]">
              <MessageCircle className="w-5 h-5" />
              {language === 'nl' ? 'Chat Support' : 'Chat Support'}
            </h3>
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
            <p className="text-sm text-gray-600">
              {language === 'nl'
                ? 'Kies hoe u contact met ons wilt opnemen voor directe ondersteuning.'
                : 'Choose how you want to contact us for direct support.'
              }
            </p>

            <div className="space-y-3">
              <Button
                onClick={openWhatsApp}
                className="w-full justify-between bg-green-600 hover:bg-green-700 text-white h-12"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  <img src="/lovable-uploads/179a6a5e-ef1b-4126-a92f-5314abdc9aa3.png" alt="WhatsApp" className="w-5 h-5" />
                  WhatsApp
                </span>
                <ExternalLink className="w-4 h-4" />
              </Button>

              <Button
                onClick={openInstagram}
                variant="outline"
                className="w-full justify-between border-2 h-12"
                style={{
                  borderColor: '#182F3C',
                  color: '#182F3C'
                }}
                size="lg"
              >
                <span className="flex items-center gap-2">
                  <Instagram className="w-5 h-5" />
                  Instagram
                </span>
                <ExternalLink className="w-4 h-4" />
              </Button>

              <Button
                onClick={openTikTok}
                variant="outline"
                className="w-full justify-between border-2 h-12"
                style={{
                  borderColor: '#182F3C',
                  color: '#182F3C'
                }}
                size="lg"
              >
                <span className="flex items-center gap-2">
                  <img src="/lovable-uploads/d637cb05-65fb-4aff-9d16-3c79e83335f6.png" alt="TikTok" className="w-5 h-5" />
                  TikTok
                </span>
                <ExternalLink className="w-4 h-4" />
              </Button>

              <Button
                onClick={openHairScan}
                className="w-full justify-between h-14"
                style={{
                  backgroundColor: '#182F3C',
                  color: 'white',
                  fontSize: '16px'
                }}
                size="lg"
              >
                <span className="flex items-center gap-2">
                  <Scan className="w-5 h-5" />
                  {language === 'nl' ? 'Doe de haarscan' : 'Take hair scan'}
                </span>
              </Button>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
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