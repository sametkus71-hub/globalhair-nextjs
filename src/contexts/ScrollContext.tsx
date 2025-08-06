import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ScrollContextType {
  currentPostIndex: number;
  totalPosts: number;
  setCurrentPostIndex: (index: number) => void;
  setTotalPosts: (total: number) => void;
  scrollToPost: (index: number) => void;
  registerScrollCallback: (callback: (index: number) => void) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};

interface ScrollProviderProps {
  children: ReactNode;
}

export const ScrollProvider = ({ children }: ScrollProviderProps) => {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [scrollCallback, setScrollCallback] = useState<((index: number) => void) | null>(null);

  const scrollToPost = useCallback((index: number) => {
    if (scrollCallback) {
      scrollCallback(index);
    }
  }, [scrollCallback]);

  const registerScrollCallback = useCallback((callback: (index: number) => void) => {
    setScrollCallback(() => callback);
  }, []);

  return (
    <ScrollContext.Provider value={{
      currentPostIndex,
      totalPosts,
      setCurrentPostIndex,
      setTotalPosts,
      scrollToPost,
      registerScrollCallback
    }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};