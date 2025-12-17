'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from "react";
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';

const NotFound = () => {
  const pathname = usePathname();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <>
      <SEOHead 
        title="Pagina niet gevonden" 
        description="De pagina die u zoekt bestaat niet." 
        noIndex={true} 
      />
      <div className="min-h-[var(--app-height)] flex items-center justify-center bg-gray-100">
        <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
