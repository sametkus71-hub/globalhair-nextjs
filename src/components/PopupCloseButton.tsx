import React, { useEffect, useState } from 'react';
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

interface SwipeablePopupWrapperProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
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

// Swipeable wrapper component for popups
export const SwipeablePopupWrapper: React.FC<SwipeablePopupWrapperProps> = ({ onClose, children, className = "" }) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const currentTouch = e.touches[0].clientY;
    const diff = currentTouch - touchStart;
    
    if (diff > 0) {
      setTouchCurrent(currentTouch);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchCurrent) {
      setTouchStart(null);
      setTouchCurrent(null);
      setIsDragging(false);
      return;
    }

    const diff = touchCurrent - touchStart;
    
    if (diff > 150) {
      onClose();
    }
    
    setTouchStart(null);
    setTouchCurrent(null);
    setIsDragging(false);
  };

  return (
    <div
      className={`touch-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isDragging && touchStart && touchCurrent 
          ? `translateY(${Math.max(0, touchCurrent - touchStart)}px)` 
          : 'translateY(0)',
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  );
};

// Hook for consistent popup close behavior
export const usePopupClose = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const getCloseTargetPath = () => {
    // Always return to haartransplantatie
    return language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
  };

  const handlePopupClose = (delay: number = 200) => {
    setTimeout(() => {
      sessionStorage.removeItem('previousPath');
      sessionStorage.removeItem('previousPage');
      sessionStorage.setItem('skipPageAnimations', 'true');
      
      // Navigate to haartransplantatie
      navigate(getCloseTargetPath());
      
      setTimeout(() => {
        sessionStorage.removeItem('skipPageAnimations');
      }, 100);
    }, delay);
  };

  return { handlePopupClose, getCloseTargetPath };
};