import { HaartransplantatieLayoutV6 } from '@/components/haartransplantatie/HaartransplantatieLayoutV6';
import HowItWorksPage from '@/components/HowItWorksPage';
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const slug = `${lang}/v6-hairboost/how`;
  const pageData = await getPageBySlug(slug);
  return generatePageMetadata(pageData);
}

export default function Page() {
  return (
    <HaartransplantatieLayoutV6>
      <HowItWorksPage />
    </HaartransplantatieLayoutV6>
  );
}
