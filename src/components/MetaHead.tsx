import { useEffect } from 'react';
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
  
  useEffect(() => {
    // Update title  
    const pageTitle = title || t(`page.${page}.title`) || t('home.title');
    document.title = `${pageTitle} | GlobalHair`;
    
    // Update meta description
    const metaDescription = description || t(`meta.${page}.description`);
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', metaDescription);
    }
    
    // Update canonical URL
    const currentPath = window.location.pathname;
    let canonicalUrl = `https://globalhair.nl${currentPath}`;
    
    // Remove existing canonical
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }
    
    // Add new canonical
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);
    
    // Remove existing hreflang tags
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach(link => link.remove());
    
    // Add hreflang tags
    const pathWithoutLang = currentPath.replace(/^\/(nl|en)/, '') || '/';
    
    // Dutch version
    const nlHreflang = document.createElement('link');
    nlHreflang.rel = 'alternate';
    nlHreflang.hreflang = 'nl';
    nlHreflang.href = `https://globalhair.nl/nl${pathWithoutLang}`;
    document.head.appendChild(nlHreflang);
    
    // English version
    const enHreflang = document.createElement('link');
    enHreflang.rel = 'alternate';
    enHreflang.hreflang = 'en';
    enHreflang.href = `https://globalhair.nl/en${pathWithoutLang}`;
    document.head.appendChild(enHreflang);
    
    // x-default points to Dutch
    const defaultHreflang = document.createElement('link');
    defaultHreflang.rel = 'alternate';
    defaultHreflang.hreflang = 'x-default';
    defaultHreflang.href = `https://globalhair.nl/nl${pathWithoutLang}`;
    document.head.appendChild(defaultHreflang);
    
  }, [language, page, title, description, t]);

  return null;
};