'use client';

// This component previously aggressively preloaded all tabs 500ms after load.
// This caused significant main-thread lag.
// It has been replaced by "Interaction-Based Preloading" in GlassTabs.tsx (hover-to-load).
// We keep the file and export to avoid breaking imports, but it does nothing now.

export const TabPreloader = () => {
  return null;
};
