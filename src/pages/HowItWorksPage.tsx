import { HowTabContent } from '@/components/haartransplantatie/HowTabContent';
import { HowTabContentDesktop } from '@/components/haartransplantatie/HowTabContentDesktop';
import { useIsMobile } from '@/hooks/use-mobile';

const HowItWorksPage = () => {
  const isMobile = useIsMobile();
  
  // Mobile/tablet uses original sliding component
  // Desktop (lg+) uses new tab-based layout
  return isMobile ? <HowTabContent /> : <HowTabContentDesktop />;
};

export default HowItWorksPage;
