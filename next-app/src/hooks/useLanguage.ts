'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';

export type Language = 'nl' | 'en';

export const useLanguage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, updateLanguage } = useSession();
  const [language, setLanguage] = useState<Language>(profile.language);

  // Extract language from current path
  const getLanguageFromPath = (): Language => {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    return (firstSegment === 'en' || firstSegment === 'nl') ? firstSegment : 'nl';
  };

  // Detect browser language preference
  const detectBrowserLanguage = (): Language => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    return 'nl'; // Default to Dutch
  };

  // Handle root redirect and sync with session
  useEffect(() => {
    if (pathname === '/') {
      // Use session language for redirect
      const targetLang = profile.language;
      
      // Redirect to appropriate language homepage
      router.push(`/${targetLang}`, { replace: true });
      return;
    }

    // Update current language based on path
    const currentLang = getLanguageFromPath();
    
    // Only update if different to prevent loops
    if (currentLang !== profile.language) {
      updateLanguage(currentLang);
    }
    
    setLanguage(currentLang);
  }, [pathname, router, profile.language, updateLanguage]);

  // Function to switch language
  const switchLanguage = (newLang: Language) => {
    // Update session first
    updateLanguage(newLang);
    
    const currentPath = pathname;
    const segments = currentPath.split('/').filter(Boolean);
    
    // Remove current language segment and add new one
    if (segments[0] === 'nl' || segments[0] === 'en') {
      segments[0] = newLang;
    } else {
      segments.unshift(newLang);
    }
    
    const newPath = '/' + segments.join('/');
    router.push(newPath);
  };

  return {
    language,
    switchLanguage,
    isNL: language === 'nl',
    isEN: language === 'en'
  };
};