import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const InfoPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    // Get previous path or default to haartransplantatie
    const previousPath = sessionStorage.getItem('previousPath') || 
                        (language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant');
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      sessionStorage.removeItem('previousPath');
      navigate(previousPath);
    }, 300);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <MetaHead 
        title={language === 'nl' ? 'Informatie' : 'Information'}
        description={language === 'nl' ? 'Informatie pagina' : 'Information page'}
        language={language}
      />
      <div className={`info-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/10 backdrop-blur-sm border border-white/20 hover:bg-black/20 transition-colors transform hover:scale-105 active:scale-95"
          aria-label={language === 'nl' ? 'Sluiten' : 'Close'}
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        {/* Scrollable Content */}
        <div className="min-h-[var(--app-height)] bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">
              {language === 'nl' ? 'Informatie' : 'Information'}
            </h1>
            <div className="text-gray-600 text-lg leading-relaxed">
              <p className="mb-6">
                {language === 'nl' 
                  ? 'Hier vindt u alle belangrijke informatie over onze diensten en behandelingen.'
                  : 'Here you will find all important information about our services and treatments.'
                }
              </p>
              {/* Content will be added later */}
            </div>
            
            {/* Extra spacing for mobile navigation */}
            <div className="h-32"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPage;