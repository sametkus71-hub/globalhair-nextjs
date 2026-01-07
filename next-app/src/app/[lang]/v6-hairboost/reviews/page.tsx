import { HaartransplantatieLayoutV6 } from '@/components/haartransplantatie/HaartransplantatieLayoutV6';
import HaartransplantatieReviewsPage from '@/components/HaartransplantatieReviewsPage';
import { getPageBySlug, generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const slug = `${lang}/v6-hairboost/reviews`;
  const pageData = await getPageBySlug(slug);
  return generatePageMetadata(pageData);
}

export default function Page() {
  return (
    <HaartransplantatieLayoutV6>
      <HaartransplantatieReviewsPage />
    </HaartransplantatieLayoutV6>
  );
}
