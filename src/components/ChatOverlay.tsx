import React from 'react';
import { X, MessageCircle, Instagram, Camera, Scan } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

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
          <h3 className="text-lg font-semibold flex items-center gap-2 text-[#182F3C]">
            <MessageCircle className="w-5 h-5" />
            {language === 'nl' ? 'Contact' : 'Contact'}
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
        <div className="p-4 space-y-3">
          {/* WhatsApp */}
          <button
            onClick={openWhatsApp}
            className="w-full p-4 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: '#25D366',
              color: 'white'
            }}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">WhatsApp</span>
          </button>

          {/* Instagram */}
          <button
            onClick={openInstagram}
            className="w-full p-4 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
              color: 'white'
            }}
          >
            <Instagram className="w-5 h-5" />
            <span className="font-medium">Instagram</span>
          </button>

          {/* TikTok */}
          <button
            onClick={openTikTok}
            className="w-full p-4 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: '#000000',
              color: 'white'
            }}
          >
            <Camera className="w-5 h-5" />
            <span className="font-medium">TikTok</span>
          </button>

          {/* Hair Scan */}
          <button
            onClick={openHairScan}
            className="w-full p-4 rounded-xl flex items-center gap-3 border-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              border: '2px solid #182F3C',
              color: '#182F3C'
            }}
          >
            <Scan className="w-5 h-5" />
            <span className="font-medium">
              {language === 'nl' ? 'Doe de haarscan' : 'Take hair scan'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};