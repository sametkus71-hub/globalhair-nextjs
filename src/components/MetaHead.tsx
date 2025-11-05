import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Language } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

interface MetaHeadProps {
  language: Language;
  page?: string;
  title?: string;
  description?: string;
}

export const MetaHead = ({ language, page = 'home', title, description }: MetaHeadProps) => {
  const { t } = useTranslation(language);
  const { pathname } = useLocation();
  
  // Compute values outside effect to stabilize dependencies
  const pageTitle = title || t(`page.${page}.title`) || t('home.title');
  const metaDescription = description || t(`meta.${page}.description`);
  
  useEffect(() => {
    // Update title only if changed
    const fullTitle = `${pageTitle} | GlobalHair`;
    if (document.title !== fullTitle) {
      document.title = fullTitle;
    }
    
    // Ensure single meta description exists and update content
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.setAttribute('name', 'description');
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute('content', metaDescription);
    
    // Update canonical URL (ensure single element)
    const canonicalUrl = `https://globalhair.nl${pathname}`;
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    if (canonical.href !== canonicalUrl) {
      canonical.href = canonicalUrl;
    }
    
    // Idempotent hreflang updates
    const pathWithoutLang = pathname.replace(/^\/(nl|en)/, '') || '/';
    
    // Dutch version
    let nlHreflang = document.querySelector('link[hreflang="nl"]') as HTMLLinkElement;
    if (!nlHreflang) {
      nlHreflang = document.createElement('link');
      nlHreflang.rel = 'alternate';
      nlHreflang.hreflang = 'nl';
      document.head.appendChild(nlHreflang);
    }
    const nlHref = `https://globalhair.nl/nl${pathWithoutLang}`;
    if (nlHreflang.href !== nlHref) {
      nlHreflang.href = nlHref;
    }
    
    // English version
    let enHreflang = document.querySelector('link[hreflang="en"]') as HTMLLinkElement;
    if (!enHreflang) {
      enHreflang = document.createElement('link');
      enHreflang.rel = 'alternate';
      enHreflang.hreflang = 'en';
      document.head.appendChild(enHreflang);
    }
    const enHref = `https://globalhair.nl/en${pathWithoutLang}`;
    if (enHreflang.href !== enHref) {
      enHreflang.href = enHref;
    }
    
    // x-default points to Dutch
    let defaultHreflang = document.querySelector('link[hreflang="x-default"]') as HTMLLinkElement;
    if (!defaultHreflang) {
      defaultHreflang = document.createElement('link');
      defaultHreflang.rel = 'alternate';
      defaultHreflang.hreflang = 'x-default';
      document.head.appendChild(defaultHreflang);
    }
    if (defaultHreflang.href !== nlHref) {
      defaultHreflang.href = nlHref;
    }
    
  }, [language, pathname, pageTitle, metaDescription]);

  return null;
};