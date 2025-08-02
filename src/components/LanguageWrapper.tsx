import { ReactNode } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';

interface LanguageWrapperProps {
  children: ReactNode;
}

export const LanguageWrapper = ({ children }: LanguageWrapperProps) => {
  const { language } = useLanguage();

  return (
    <>
      <MetaHead language={language} />
      {children}
    </>
  );
};