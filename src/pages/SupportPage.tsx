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
        floatbutton?: {
          visible: (state: "show" | "hide") => void;
        };
        chatwindow?: {
          visible: (state: "show" | "hide") => void;
          closebutton: (state: "show" | "hide") => void;
          open: () => void;
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
        // Ensure floating elements are hidden
        window.$zoho.salesiq.floatbutton?.visible("hide");
        window.$zoho.salesiq.floatwindow?.visible("hide");
        
        // Open the chat window directly and make it visible
        window.$zoho.salesiq.chatwindow.open();
        window.$zoho.salesiq.chatwindow.visible("show");
        
        // Hide Zoho's close button completely
        window.$zoho.salesiq.chatwindow.closebutton("hide");
        
        // Override any close events from Zoho to use our navigation
        const chatWindow = document.querySelector('#zsiqwidget');
        if (chatWindow) {
          // Look for any close buttons in the Zoho widget and override their behavior
          const observer = new MutationObserver(() => {
            const closeButtons = chatWindow.querySelectorAll('[title*="close"], [aria-label*="close"], .zsiq-min, .zsiq-close');
            closeButtons.forEach(button => {
              button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              });
            });
          });
          
          observer.observe(chatWindow, { childList: true, subtree: true });
          
          // Return cleanup function for the observer
          return () => observer.disconnect();
        }
      }
    };

    // Try to show immediately if Zoho is ready
    if (window.$zoho?.salesiq?.chatwindow) {
      const cleanup = showChatWindow();
      return cleanup;
    } else {
      // Wait for Zoho to load with multiple attempts
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      let cleanup: (() => void) | undefined;
      
      const checkZoho = setInterval(() => {
        attempts++;
        if (window.$zoho?.salesiq?.chatwindow) {
          cleanup = showChatWindow();
          clearInterval(checkZoho);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkZoho);
          console.warn('Zoho SalesIQ failed to load after 5 seconds');
        }
      }, 100);

      return () => {
        clearInterval(checkZoho);
        if (cleanup) cleanup();
        // Cleanup - hide everything when component unmounts
        if (window.$zoho?.salesiq) {
          window.$zoho.salesiq.chatwindow?.visible("hide");
          window.$zoho.salesiq.floatwindow?.visible("hide");
          window.$zoho.salesiq.floatbutton?.visible("hide");
        }
      };
    }
  }, [handleClose]);

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
          
          {/* Close button - positioned above Zoho widget */}
          <PopupCloseButton onClose={handleClose} className="z-[9999]" />
          
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