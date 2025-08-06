import { CentralLogo } from '@/components/homepage/CentralLogo';
import { useLocation } from 'react-router-dom';

export const GlobalCentralLogo = () => {
  const location = useLocation();
  const isHaartransplantatiePage = location.pathname.includes('/haartransplantatie') || location.pathname.includes('/hair-transplant');
  
  if (isHaartransplantatiePage) {
    // On haartransplantatie page, render logo in middle but not fixed (scrolls with content)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <CentralLogo />
        </div>
      </div>
    );
  }
  
  // On other pages, render as fixed position
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <CentralLogo />
      </div>
    </div>
  );
};