import { HaartransplantatieLayoutV6 } from '@/components/haartransplantatie/HaartransplantatieLayoutV6';
import HaartransplantatieContactPage from '@/components/HaartransplantatieContactPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact V6 Hairboost® | GlobalHair Institute',
  description: 'Neem contact op met GlobalHair Institute voor meer informatie over V6 Hairboost® behandeling.',
};

export default function Page() {
  return (
    <HaartransplantatieLayoutV6>
      <HaartransplantatieContactPage />
    </HaartransplantatieLayoutV6>
  );
}
