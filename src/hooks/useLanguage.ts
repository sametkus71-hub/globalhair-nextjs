import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type Language = 'nl' | 'en';

export const useLanguage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('nl');

  // Extract language from current path
  const getLanguageFromPath = (): Language => {
    const segments = location.pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    return (firstSegment === 'en' || firstSegment === 'nl') ? firstSegment : 'nl';
  };

  // Detect browser language preference
  const detectBrowserLanguage = (): Language => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    return 'nl'; // Default to Dutch
  };

  // Handle root redirect
  useEffect(() => {
    if (location.pathname === '/') {
      // Check localStorage for saved preference
      const savedLang = localStorage.getItem('gh_lang') as Language;
      const targetLang = savedLang || detectBrowserLanguage();
      
      // Redirect to appropriate language homepage
      navigate(`/${targetLang}`, { replace: true });
      return;
    }

    // Update current language based on path
    const currentLang = getLanguageFromPath();
    setLanguage(currentLang);
    
    // Save to localStorage
    localStorage.setItem('gh_lang', currentLang);
  }, [location.pathname, navigate]);

  // Function to switch language
  const switchLanguage = (newLang: Language) => {
    const currentPath = location.pathname;
    const segments = currentPath.split('/').filter(Boolean);
    
    // Remove current language segment and add new one
    if (segments[0] === 'nl' || segments[0] === 'en') {
      segments[0] = newLang;
    } else {
      segments.unshift(newLang);
    }
    
    const newPath = '/' + segments.join('/');
    navigate(newPath);
  };

  return {
    language,
    switchLanguage,
    isNL: language === 'nl',
    isEN: language === 'en'
  };
};