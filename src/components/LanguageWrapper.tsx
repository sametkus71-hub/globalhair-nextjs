import { ReactNode } from 'react';

interface LanguageWrapperProps {
  children: ReactNode;
}

export const LanguageWrapper = ({ children }: LanguageWrapperProps) => {
  // No longer renders MetaHead - each page handles its own SEO with SEOHead
  return <>{children}</>;
};