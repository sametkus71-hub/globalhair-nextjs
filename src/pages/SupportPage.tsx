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
    handlePopupClose(200);
  };

  // Load Zoho SalesIQ chatbot script
  useEffect(() => {
    // Initialize Zoho object
    if (!window.$zoho) {
      window.$zoho = {};
    }
    if (!window.$zoho.salesiq) {
      window.$zoho.salesiq = { ready: function() {} };
    }

    // Load the script if not already loaded
    if (!document.getElementById('zsiqscript')) {
      const script = document.createElement('script');
      script.id = 'zsiqscript';
      script.src = 'https://salesiq.zohopublic.eu/widget?wc=siq01d1b3e0629f4cfbc6d3756bcfdbb157078935b69673e3f7f335806dd39409e8';
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if needed
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