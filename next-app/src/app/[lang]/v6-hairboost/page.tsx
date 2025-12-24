import { HaartransplantatieLayoutV6 } from '@/components/haartransplantatie/HaartransplantatieLayoutV6';
import { TreatmentsTabContent } from '@/components/haartransplantatie/TreatmentsTabContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'V6 Hairboost® - GlobalHair Institute',
  description: 'Discover our revolutionary V6 Hairboost® treatment for advanced hair restoration.',
};

export default function V6HairboostPage() {
  return (
    <HaartransplantatieLayoutV6>
      <TreatmentsTabContent />
    </HaartransplantatieLayoutV6>
  );
}
