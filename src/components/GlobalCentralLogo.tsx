import { useLocation } from 'react-router-dom';
import { CentralLogo } from '@/components/homepage/CentralLogo';
import { useTransition } from '@/contexts/TransitionContext';
import { TransitionLogo } from '@/components/TransitionLogo';

export const GlobalCentralLogo = () => {
  const location = useLocation();
  const { transitionState } = useTransition();
  
  // Hide on haartransplantatie pages since they have their own ScrollFadeLogo
  const isHaartransplantatiePage = location.pathname.includes('/haartransplantatie') || 
                                   location.pathname.includes('/hair-transplant') ||
                                   location.pathname.includes('/v6-hairboost');
  
  if (isHaartransplantatiePage) {
    return null;
  }

  return (
    <>
      {/* Regular logo - hidden during logo transition */}
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none transition-opacity duration-200 ${
          transitionState.logoScaleUp || transitionState.logoFadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="pointer-events-auto">
          <CentralLogo />
        </div>
      </div>
      
      {/* Transition logo for scaling effect */}
      <TransitionLogo 
        isScalingUp={transitionState.logoScaleUp}
        isFadingOut={transitionState.logoFadeOut}
      />
    </>
  );
};