import { ReactNode, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';

interface SessionManagerProps {
  children: ReactNode;
}

export const SessionManager = ({ children }: SessionManagerProps) => {
  const { profile } = useSession();

  useEffect(() => {
    // Initialize session storage and body classes on mount
    console.log('Session Manager initialized with profile:', profile);
  }, [profile]);

  return <>{children}</>;
};