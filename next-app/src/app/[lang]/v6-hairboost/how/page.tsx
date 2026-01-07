import { HaartransplantatieLayoutV6 } from '@/components/haartransplantatie/HaartransplantatieLayoutV6';
import HowItWorksPage from '@/components/HowItWorksPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hoe werkt V6 Hairboost®? | GlobalHair Institute',
  description: 'Ontdek hoe onze revolutionaire V6 Hairboost® behandeling werkt voor geavanceerd haarherstel.',
};

export default function Page() {
  return (
    <HaartransplantatieLayoutV6>
      <HowItWorksPage />
    </HaartransplantatieLayoutV6>
  );
}
