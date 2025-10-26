import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import closeIcon from '@/assets/close-icon.svg';

interface PopupCloseButtonProps {
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
  isBackButton?: boolean;
}

export const PopupCloseButton: React.FC<PopupCloseButtonProps> = ({ 
  onClose, 
  className = "",
  style,
  isBackButton = false
}) => {
  const { language } = useLanguage();

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <button
      onClick={onClose}
      className={`fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center transition-opacity duration-200 hover:opacity-70 rounded-full ${className}`}
      style={{
        backgroundColor: 'rgba(217, 217, 217, 0.2)',
        ...style
      }}
      aria-label={isBackButton ? (language === 'nl' ? 'Terug' : 'Back') : (language === 'nl' ? 'Sluiten' : 'Close')}
    >
      {isBackButton ? (
        <ArrowLeft className="w-5 h-5 text-white" />
      ) : (
        <img src={closeIcon} alt="" className="w-4.5 h-4.5" />
      )}
    </button>
  );
};

// Hook for consistent popup close behavior
export const usePopupClose = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const getCloseTargetPath = () => {
    // Check if user came from v6hairboost
    const previousPage = sessionStorage.getItem('previousPage');
    
    if (previousPage && previousPage.includes('v6hairboost')) {
      return language === 'nl' ? '/nl/v6-hairboost' : '/en/v6-hairboost';
    }
    
    // Default to haartransplantatie
    return language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
  };

  const handlePopupClose = (delay: number = 200) => {
    setTimeout(() => {
      // Clear stored paths
      sessionStorage.removeItem('previousPath');
      sessionStorage.removeItem('previousPage');
      sessionStorage.setItem('skipPageAnimations', 'true');
      
      // Go back to previous page in browser history
      navigate(-1);
      
      // Remove skip flag after navigation
      setTimeout(() => {
        sessionStorage.removeItem('skipPageAnimations');
      }, 100);
    }, delay);
  };

  return { handlePopupClose, getCloseTargetPath };
};