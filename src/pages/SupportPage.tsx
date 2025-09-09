import React, { useState, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';

// TypeScript declaration for Zoho SalesIQ
declare global {
  interface Window {
    $zoho?: {
      salesiq?: {
        ready: () => void;
        floatwindow?: {
          visible: (state: "show" | "hide") => void;
        };
        chatwindow?: {
          visible: (state: "show" | "hide") => void;
          closebutton: (state: "show" | "hide") => void;
        };
      };
    };
  }
}

const SupportPage: React.FC = () => {
  const { language } = useLanguage();
  const { handlePopupClose } = usePopupClose();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    // Hide chat window when leaving
    if (window.$zoho?.salesiq?.chatwindow) {
      window.$zoho.salesiq.chatwindow.visible("hide");
      window.$zoho.salesiq.floatwindow?.visible("hide");
    }
    handlePopupClose(200);
  };

  // Show Zoho SalesIQ chat window on mount
  useEffect(() => {
    const showChatWindow = () => {
      if (window.$zoho?.salesiq?.chatwindow) {
        // Show the chat window immediately
        window.$zoho.salesiq.floatwindow?.visible("show");
        window.$zoho.salesiq.chatwindow.visible("show");
        // Hide the close button for full-page experience
        window.$zoho.salesiq.chatwindow.closebutton("hide");
      }
    };

    // If Zoho is already loaded, show immediately
    if (window.$zoho?.salesiq?.chatwindow) {
      showChatWindow();
    } else {
      // Wait for Zoho to load
      const checkZoho = setInterval(() => {
        if (window.$zoho?.salesiq?.chatwindow) {
          showChatWindow();
          clearInterval(checkZoho);
        }
      }, 100);

      return () => clearInterval(checkZoho);
    }

    return () => {
      // Cleanup - hide chat when component unmounts
      if (window.$zoho?.salesiq?.chatwindow) {
        window.$zoho.salesiq.chatwindow.visible("hide");
        window.$zoho.salesiq.floatwindow?.visible("hide");
      }
    };
  }, []);

  return (
    <>
      <MetaHead 
        title={language === 'nl' ? 'Ondersteuning' : 'Support'}
        description={language === 'nl' ? 'Ondersteuning pagina' : 'Support page'}
        language={language}
      />
      <div className={`support-page-fullscreen overflow-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Background matching haartransplantatie page */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#E4E5E0' }}>
          
          {/* Close button */}
          <PopupCloseButton onClose={handleClose} />
          
          {/* Chatbot Container - Full width and height with no padding/borders */}
          <div className="w-full h-[var(--app-height)] pt-16">
            <div 
              id="zoho-salesiq-container" 
              className="w-full h-full"
              style={{ 
                border: 'none',
                padding: '0',
                margin: '0',
                overflow: 'hidden'
              }}
            />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default SupportPage;