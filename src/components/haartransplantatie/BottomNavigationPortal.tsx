import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BottomNavigation } from './BottomNavigation';

export const BottomNavigationPortal: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(<BottomNavigation />, document.body);
};