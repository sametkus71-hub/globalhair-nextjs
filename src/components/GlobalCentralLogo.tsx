import { CentralLogo } from '@/components/homepage/CentralLogo';

export const GlobalCentralLogo = () => {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <CentralLogo />
      </div>
    </div>
  );
};