'use client';

import { useViewportHeight } from '@/hooks/useViewportHeight';

export const ViewportHeightSetter = () => {
  // Initialize and keep --app-height updated globally
  useViewportHeight();
  return null;
};

export default ViewportHeightSetter;

