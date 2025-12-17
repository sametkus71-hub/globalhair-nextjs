'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePageTransition, TransitionState } from '@/hooks/usePageTransition';

interface TransitionContextType {
  transitionState: TransitionState;
  startTransition: (targetPath: string, delay?: number) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const { transitionState, startTransition } = usePageTransition();

  return (
    <TransitionContext.Provider value={{ transitionState, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};