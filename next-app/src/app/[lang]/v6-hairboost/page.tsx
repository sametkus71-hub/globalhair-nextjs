import { HaartransplantatieLayoutV6 } from '@/components/haartransplantatie/HaartransplantatieLayoutV6';
import { TreatmentsTabContent } from '@/components/haartransplantatie/TreatmentsTabContent';
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const slug = `${lang}/v6-hairboost`;
  const page = await getPageBySlug(slug);
  return generatePageMetadata(page);
}

export default function V6HairboostPage() {
  return (
    <HaartransplantatieLayoutV6>
      <TreatmentsTabContent />
    </HaartransplantatieLayoutV6>
  );
}
