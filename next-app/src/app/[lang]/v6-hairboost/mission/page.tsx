import { HaartransplantatieLayoutV6 } from '@/components/haartransplantatie/HaartransplantatieLayoutV6';
import HaartransplantatieMissionPage from '@/components/HaartransplantatieMissionPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'V6 Hairboost® Missie | GlobalHair Institute',
  description: 'Ontdek de missie achter V6 Hairboost® en onze toewijding aan geavanceerd haarherstel.',
};

export default function Page() {
  return (
    <HaartransplantatieLayoutV6>
      <HaartransplantatieMissionPage />
    </HaartransplantatieLayoutV6>
  );
}
