import { HaartransplantatieLayoutV6 } from '@/components/haartransplantatie/HaartransplantatieLayoutV6';
import HaartransplantatieReviewsPage from '@/components/HaartransplantatieReviewsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'V6 Hairboost® Reviews & Ervaringen | GlobalHair Institute',
  description: 'Bekijk echte ervaringen en reviews van klanten die V6 Hairboost® behandeling bij GlobalHair Institute hebben gehad.',
};

export default function Page() {
  return (
    <HaartransplantatieLayoutV6>
      <HaartransplantatieReviewsPage />
    </HaartransplantatieLayoutV6>
  );
}
