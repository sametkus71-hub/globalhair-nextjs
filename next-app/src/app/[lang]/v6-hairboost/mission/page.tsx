import { HaartransplantatieLayoutV6 } from '@/components/haartransplantatie/HaartransplantatieLayoutV6';
import HaartransplantatieMissionPage from '@/components/HaartransplantatieMissionPage';
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const slug = `${lang}/v6-hairboost/mission`;
  const pageData = await getPageBySlug(slug);
  return generatePageMetadata(pageData);
}

export default function Page() {
  return (
    <HaartransplantatieLayoutV6>
      <HaartransplantatieMissionPage />
    </HaartransplantatieLayoutV6>
  );
}
