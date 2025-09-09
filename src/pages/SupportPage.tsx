import React, { useState, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { waitForSalesIQ } from '@/lib/salesiq';

// TypeScript declaration for Zoho SalesIQ
declare global {
  interface Window {
    $zoho?: {
      salesiq?: {
        ready: () => void;
        floatwindow?: {
          visible: (state: "show" | "hide") => void;
        };
        floatbutton?: {
          visible: (state: "show" | "hide") => void;
        };
        chatbutton?: {
          visible: (state: "show" | "hide") => void;
        };
        chatwindow?: {
          visible: (state: "show" | "hide") => void;
          closebutton?: (state: "show" | "hide") => void;
          open?: () => void;
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
    const siq = (window as any).$zoho?.salesiq;
    if (siq) {
      siq.chatwindow?.visible("hide");
      siq.floatwindow?.visible("hide");
    }
    handlePopupClose(200);
  };

  useEffect(() => {
    let didUnmount = false;

    waitForSalesIQ(() => {
      if (didUnmount) return;
      const siq = (window as any).$zoho.salesiq;

      // Toon/open chatvenster direct op /support
      siq.floatwindow.visible("show");
      siq.chatwindow.visible("show");

      // Verberg de standaard closebutton zodat jij zelf controle hebt
      if (siq.chatwindow?.closebutton) {
        siq.chatwindow.closebutton("hide");
      }

      // Hide Zoho's close button and logo with CSS
      const style = document.createElement('style');
      style.textContent = `
        /* Hide Zoho close buttons and logos */
        #zsiqwidget .zsiq-min,
        #zsiqwidget .zsiq-close,
        #zsiqwidget [title*="close"],
        #zsiqwidget [aria-label*="close"],
        #zsiqwidget .zsiq-header-close,
        #zsiqwidget .zsiq-logo,
        #zsiqwidget .zsiq-branding {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Ensure our close button is above everything */
        .popup-close-button {
          z-index: 2247483648 !important;
          position: fixed !important;
        }
      `;
      document.head.appendChild(style);
    });

    // Opruimen bij verlaten van /support
    return () => {
      didUnmount = true;
      const siq = (window as any).$zoho?.salesiq;
      if (siq) {
        siq.chatwindow?.visible("hide");
        siq.floatwindow?.visible("hide");
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
          
          {/* JOUW eigen close-button (sluit chat en navigeer weg) */}
          <PopupCloseButton 
            onClose={handleClose} 
            className="popup-close-button !fixed" 
            style={{ zIndex: 2247483648 }}
          />
          
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