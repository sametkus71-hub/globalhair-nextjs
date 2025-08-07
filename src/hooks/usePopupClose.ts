import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';

export const usePopupClose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  // Track the previous path when component mounts
  useEffect(() => {
    // Get the previous path from session storage or navigation state
    const prevPath = sessionStorage.getItem('previousPath');
    setPreviousPath(prevPath);
  }, []);

  const isPopupPath = (path: string) => {
    return path.includes('/reviews') || 
           path.includes('/missie') || 
           path.includes('/mission');
  };

  const handleClose = () => {
    const homePath = language === 'nl' ? '/nl' : '/en';
    
    // If previous path was a popup or doesn't exist, go to home
    if (!previousPath || isPopupPath(previousPath)) {
      navigate(homePath);
    } else {
      // Go back to the previous non-popup page
      navigate(previousPath);
    }
    
    // Clear the stored path
    sessionStorage.removeItem('previousPath');
  };

  return { handleClose };
};