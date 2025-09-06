import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface PopupCloseButtonProps {
  onClose: () => void;
  className?: string;
}

export const PopupCloseButton: React.FC<PopupCloseButtonProps> = ({ 
  onClose, 
  className = "" 
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
      className={`fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/50 hover:bg-black/50 transition-all duration-200 flex items-center justify-center overflow-hidden glass-shine ${className}`}
      aria-label={language === 'nl' ? 'Sluiten' : 'Close'}
    >
      <X className="w-5 h-5 text-white" />
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
    const targetPath = getCloseTargetPath();
    
    setTimeout(() => {
      // Clear stored paths
      sessionStorage.removeItem('previousPath');
      sessionStorage.removeItem('previousPage');
      sessionStorage.setItem('skipPageAnimations', 'true');
      
      navigate(targetPath);
      
      // Remove skip flag after navigation
      setTimeout(() => {
        sessionStorage.removeItem('skipPageAnimations');
      }, 100);
    }, delay);
  };

  return { handlePopupClose, getCloseTargetPath };
};