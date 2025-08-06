import { ReactNode, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';

interface SessionManagerProps {
  children: ReactNode;
}

export const SessionManager = ({ children }: SessionManagerProps) => {
  const { profile } = useSession();

  useEffect(() => {
    // Initialize session storage and body classes on mount
  }, [profile]);

  return <>{children}</>;
};