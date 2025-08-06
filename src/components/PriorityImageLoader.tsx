import { useState, useEffect } from 'react';
import { preloadImage } from '@/components/ImagePreloader';

export interface PriorityAsset {
  src: string;
  priority: 'critical' | 'high' | 'normal';
}

interface PriorityImageLoaderProps {
  assets: PriorityAsset[];
  onCriticalLoaded?: () => void;
  onHighLoaded?: () => void;
  onAllLoaded?: () => void;
}

export const PriorityImageLoader = ({ 
  assets, 
  onCriticalLoaded, 
  onHighLoaded, 
  onAllLoaded 
}: PriorityImageLoaderProps) => {
  const [loadingStates, setLoadingStates] = useState({
    critical: false,
    high: false,
    all: false
  });

  useEffect(() => {
    const critical = assets.filter(asset => asset.priority === 'critical');
    const high = assets.filter(asset => asset.priority === 'high');
    const normal = assets.filter(asset => asset.priority === 'normal');

    const loadPhase = async (phaseAssets: PriorityAsset[], phase: 'critical' | 'high' | 'all') => {
      try {
        await Promise.allSettled(phaseAssets.map(asset => preloadImage(asset.src)));
        
        setLoadingStates(prev => ({ ...prev, [phase]: true }));
        
        if (phase === 'critical') {
          onCriticalLoaded?.();
        } else if (phase === 'high') {
          onHighLoaded?.();
        } else if (phase === 'all') {
          onAllLoaded?.();
        }
      } catch (error) {
        console.warn(`Failed to load ${phase} assets:`, error);
        // Continue anyway to prevent blocking
        setLoadingStates(prev => ({ ...prev, [phase]: true }));
        
        if (phase === 'critical') {
          onCriticalLoaded?.();
        } else if (phase === 'high') {
          onHighLoaded?.();
        } else if (phase === 'all') {
          onAllLoaded?.();
        }
      }
    };

    // Load phases sequentially but don't block
    const loadSequentially = async () => {
      // Phase 1: Critical assets (logo)
      if (critical.length > 0) {
        await loadPhase(critical, 'critical');
      } else {
        setLoadingStates(prev => ({ ...prev, critical: true }));
        onCriticalLoaded?.();
      }

      // Phase 2: High priority assets (hair colors) - start immediately after critical
      if (high.length > 0) {
        await loadPhase(high, 'high');
      } else {
        setLoadingStates(prev => ({ ...prev, high: true }));
        onHighLoaded?.();
      }

      // Phase 3: Normal priority assets
      if (normal.length > 0) {
        await loadPhase(normal, 'all');
      } else {
        setLoadingStates(prev => ({ ...prev, all: true }));
        onAllLoaded?.();
      }
    };

    loadSequentially();
  }, [assets, onCriticalLoaded, onHighLoaded, onAllLoaded]);

  return null; // This component doesn't render anything
};

export default PriorityImageLoader;