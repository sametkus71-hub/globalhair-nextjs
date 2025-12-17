'use client';

import Head from "next/head";
import { usePathname, useSearchParams } from 'next/navigation';

const BASE_URL = 'https://globalhair.institute';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
}

export const SEOHead = ({ title, description, canonical, noIndex = false }: SEOHeadProps) => {
  const pathname = usePathname() || '/';
  const canonicalUrl = canonical || `${BASE_URL}${pathname}`;

  // Generate hreflang alternates
  const pathWithoutLang = pathname.replace(/^\/(nl|en)/, '') || '/';
  const nlUrl = `${BASE_URL}/nl${pathWithoutLang}`;
  const enUrl = `${BASE_URL}/en${pathWithoutLang}`;

  const fullTitle = `${title} | GlobalHair Institute`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {/* Hreflang */}
      <link rel="alternate" hrefLang="nl" href={nlUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={nlUrl} />
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="GlobalHair Institute" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Head>
  );
};
