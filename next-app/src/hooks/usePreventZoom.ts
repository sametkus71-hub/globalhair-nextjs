'use client';

import { useEffect } from 'react';

export const usePreventZoom = () => {
  useEffect(() => {
    // Prevent zoom on wheel events
    const preventWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Prevent pinch-to-zoom
    const preventTouch = (e: TouchEvent) => {
      // Prevent zoom gestures (2+ touches)
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent zoom on keyboard shortcuts
    const preventKeyboard = (e: KeyboardEvent) => {
      // Prevent Ctrl/Cmd + Plus/Minus/0
      if ((e.ctrlKey || e.metaKey) && (
        e.key === '+' || 
        e.key === '-' || 
        e.key === '=' || 
        e.key === '0'
      )) {
        e.preventDefault();
      }
    };

    // Prevent context menu on long press
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Prevent drag and drop
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    // Prevent text selection on double tap
    const preventSelection = () => {
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
    };

    // Add event listeners
    document.addEventListener('wheel', preventWheel, { passive: false });
    document.addEventListener('touchstart', preventTouch, { passive: false });
    document.addEventListener('touchmove', preventTouch, { passive: false });
    document.addEventListener('keydown', preventKeyboard, { passive: false });
    document.addEventListener('contextmenu', preventContextMenu, { passive: false });
    document.addEventListener('dragstart', preventDrag, { passive: false });
    document.addEventListener('selectstart', preventSelection, { passive: false });

    // Additional iOS specific prevention
    const preventGestures = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('gesturestart', preventGestures, { passive: false });
    document.addEventListener('gesturechange', preventGestures, { passive: false });
    document.addEventListener('gestureend', preventGestures, { passive: false });

    return () => {
      document.removeEventListener('wheel', preventWheel);
      document.removeEventListener('touchstart', preventTouch);
      document.removeEventListener('touchmove', preventTouch);
      document.removeEventListener('keydown', preventKeyboard);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('dragstart', preventDrag);
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('gesturestart', preventGestures);
      document.removeEventListener('gesturechange', preventGestures);
      document.removeEventListener('gestureend', preventGestures);
    };
  }, []);
};