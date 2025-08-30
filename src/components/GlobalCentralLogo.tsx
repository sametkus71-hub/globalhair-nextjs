import { useLocation } from 'react-router-dom';
import { CentralLogo } from '@/components/homepage/CentralLogo';
import { useTransition } from '@/contexts/TransitionContext';
import { cn } from '@/lib/utils';

export const GlobalCentralLogo = () => {
  const location = useLocation();
  const { transitionState } = useTransition();
  
  // Only show on home page
  const isHomePage = location.pathname === '/' || 
                     location.pathname === '/nl' || 
                     location.pathname === '/en';
  
  if (!isHomePage) {
    return null;
  }

  // Hide logo completely during transition
  if (transitionState.isTransitioning && 
      (transitionState.logoScaleUp || transitionState.logoFadeOut)) {
    return (
      <div 
        className={cn(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none",
          transitionState.logoScaleUp && "logo-scale-up-smooth", 
          transitionState.logoFadeOut && "logo-fade-out-smooth"
        )}
      >
        <div className="pointer-events-auto">
          <CentralLogo />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none">
      <div className="pointer-events-auto">
        <CentralLogo />
      </div>
    </div>
  );
};