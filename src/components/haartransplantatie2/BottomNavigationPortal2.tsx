import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BottomNavigation2 } from './BottomNavigation2';

export const BottomNavigationPortal2: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(<BottomNavigation2 />, document.body);
};