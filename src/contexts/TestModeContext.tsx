import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TestModeContextType {
  isTestMode: boolean;
  activateTestMode: () => void;
  getTestPrice: (originalPrice: number) => number;
}

const TestModeContext = createContext<TestModeContextType | undefined>(undefined);

export const TestModeProvider = ({ children }: { children: ReactNode }) => {
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Check session storage on mount
    const testMode = sessionStorage.getItem('staffTestMode') === 'true';
    setIsTestMode(testMode);
  }, []);

  const activateTestMode = () => {
    setIsTestMode(true);
    sessionStorage.setItem('staffTestMode', 'true');
  };

  const getTestPrice = (originalPrice: number): number => {
    return isTestMode ? 0.5 : originalPrice;
  };

  return (
    <TestModeContext.Provider value={{ isTestMode, activateTestMode, getTestPrice }}>
      {children}
    </TestModeContext.Provider>
  );
};

export const useTestMode = () => {
  const context = useContext(TestModeContext);
  if (context === undefined) {
    throw new Error('useTestMode must be used within a TestModeProvider');
  }
  return context;
};
