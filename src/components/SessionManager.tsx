import { ReactNode, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';

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
  }, [profile, language]);

  return <>{children}</>;
};