'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { initializeAnalytics } from '@/lib/analytics';
import { hasValidConsent, isCategoryAllowed } from '@/lib/cookie-consent';
import { initializeMetaPixel } from '@/lib/metaPixel';

interface SessionManagerProps {
  children: ReactNode;
}

export const SessionManager = ({ children }: SessionManagerProps) => {
  const { profile, language } = useSession();

  useEffect(() => {
    // Initialize session storage and body classes on mount
    // Set html lang attribute for SEO
    document.documentElement.lang = language;
    
    // Add language class to html for styling
    document.documentElement.className = document.documentElement.className
      .replace(/lang-(nl|en)/g, '').trim();
    document.documentElement.classList.add(`lang-${language}`);
    
    console.info('Session initialized:', { profile, language });
    
    // Initialize analytics if consent given
    if (hasValidConsent() && isCategoryAllowed('analytics')) {
      initializeAnalytics();
    }
    
    // Initialize Meta Pixel if marketing consent given
    if (hasValidConsent() && isCategoryAllowed('marketing')) {
      initializeMetaPixel();
    }
  }, [profile, language]);

  return <>{children}</>;
};