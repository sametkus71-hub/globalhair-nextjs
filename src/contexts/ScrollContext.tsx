import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ScrollContextType {
  currentPostIndex: number;
  totalPosts: number;
  scrollToPost: (index: number) => void;
  registerScrollCallback: (callback: (index: number) => void) => void;
  setTotalPosts: (total: number) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

interface ScrollProviderProps {
  children: ReactNode;
}

export const ScrollProvider = ({ children }: ScrollProviderProps) => {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [totalPosts, setTotalPosts] = useState(6); // Default: 1 hero + 5 posts
  const [scrollCallback, setScrollCallback] = useState<((index: number) => void) | null>(null);

  const scrollToPost = useCallback((index: number) => {
    if (index < 0 || index >= totalPosts) return;
    
    setCurrentPostIndex(index);
    
    if (scrollCallback) {
      scrollCallback(index);
    }
  }, [totalPosts, scrollCallback]);

  const registerScrollCallback = useCallback((callback: (index: number) => void) => {
    setScrollCallback(() => callback);
  }, []);

  return (
    <ScrollContext.Provider value={{
      currentPostIndex,
      totalPosts,
      scrollToPost,
      registerScrollCallback,
      setTotalPosts
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