import { ReactNode } from 'react';
import { useSession } from '@/hooks/useSession';
import { MetaHead } from '@/components/MetaHead';

interface LanguageWrapperProps {
  children: ReactNode;
}

export const LanguageWrapper = ({ children }: LanguageWrapperProps) => {
  const { language } = useSession();

  return (
    <>
      <MetaHead language={language} />
      {children}
    </>
  );
};