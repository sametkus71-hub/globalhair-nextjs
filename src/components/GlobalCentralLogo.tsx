import { useLocation } from 'react-router-dom';
import { CentralLogo } from '@/components/homepage/CentralLogo';

export const GlobalCentralLogo = () => {
  const location = useLocation();
  
  // Hide on haartransplantatie pages since they have their own ScrollFadeLogo
  const isHaartransplantatiePage = location.pathname.includes('/haartransplantatie') || location.pathname.includes('/hair-transplant');
  
  if (isHaartransplantatiePage) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none">
      <div className="pointer-events-auto bg-red-500/20 p-4 rounded-lg">
        <CentralLogo />
      </div>
    </div>
  );
};