import { Language } from '@/hooks/useLanguage';

export const translations = {
  nl: {
    // Navigation
    'nav.home': 'Home',
    'nav.haartransplantatie': 'Haartransplantatie',
    'nav.v6hairboost': 'V6 Hairboost',
    'nav.dashboard': 'Dashboard',
    'nav.form': 'Haaranalyse',
    
    // Homepage
    'home.title': 'Premium Haartransplantatie & V6 Hairboost',
    'home.subtitle': 'Ontdek de meest geavanceerde behandelingen voor uw haar',
    'home.select.gender': 'Selecteer uw geslacht',
    'home.select.hairtype': 'Selecteer uw haartype',
    'home.select.haircolor': 'Selecteer uw haarkleur',
    'home.continue': 'Verder naar behandelingen',
    
    // Gender options
    'gender.man': 'Man',
    'gender.vrouw': 'Vrouw',
    
    // Hair types
    'hairtype.fijn': 'Fijn haar',
    'hairtype.stijl': 'Stijl haar',
    'hairtype.krul': 'Krullend haar',
    'hairtype.kroes': 'Kroes haar',
    
    // Hair colors
    'haircolor.zwart': 'Zwart',
    'haircolor.bruin': 'Bruin',
    'haircolor.blond': 'Blond',
    'haircolor.wit': 'Wit',
    
    // Meta descriptions
    'meta.home.description': 'Ontdek de meest geavanceerde haartransplantatie technieken en V6 Hairboost behandelingen bij GlobalHair.',
    'meta.haartransplantatie.description': 'Professionele haartransplantatie met de nieuwste technieken en jarenlange ervaring.',
    'meta.v6hairboost.description': 'V6 Hairboost - revolutionaire haargroei behandeling voor optimale resultaten.',
    
    // Pages
    'page.haartransplantatie.title': 'Haartransplantatie',
    'page.v6hairboost.title': 'V6 Hairboost',
    'page.coming-soon': 'Binnenkort beschikbaar',
    
    // Reviews
    'reviews.title': 'Bekijk onze reviews',
    'reviews.description': 'Ontdek wat onze klanten zeggen over hun ervaringen met onze behandelingen.',
    'reviews.close': 'Sluiten',
    
    // Mission
    'mission.title': 'Onze Missie',
    'mission.subtitle': 'Excellentie in haarzorg en esthetiek',
    'mission.description1': 'Bij GlobalHair streven we naar het hoogste niveau van haarzorg en esthetische behandelingen. Onze missie is om elke cliënt te voorzien van natuurlijke, blijvende resultaten die hun zelfvertrouwen versterken.',
    'mission.description2': 'Met jaren van expertise en de nieuwste technologieën bieden wij persoonlijke zorg die voldoet aan de hoogste internationale standaarden.',
    'mission.description3': 'Wij geloven dat iedereen het recht heeft om zich goed te voelen over hun uiterlijk, en wij zijn er om dat mogelijk te maken.',
    'mission.value1.title': 'Kwaliteit',
    'mission.value1.description': 'Wij hanteren de hoogste kwaliteitsnormen in alle aspecten van onze behandelingen.',
    'mission.value2.title': 'Innovatie',
    'mission.value2.description': 'Wij investeren continu in de nieuwste technieken en technologieën.',
    'mission.value3.title': 'Zorg',
    'mission.value3.description': 'Persoonlijke aandacht en nazorg staan centraal in onze benadering.',
    'mission.close': 'Sluiten',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.haartransplantatie': 'Hair Transplant',
    'nav.v6hairboost': 'V6 Hairboost',
    'nav.dashboard': 'Dashboard',
    'nav.form': 'Hair Analysis',
    
    // Homepage
    'home.title': 'Premium Hair Transplant & V6 Hairboost',
    'home.subtitle': 'Discover the most advanced treatments for your hair',
    'home.select.gender': 'Select your gender',
    'home.select.hairtype': 'Select your hair type',
    'home.select.haircolor': 'Select your hair color',
    'home.continue': 'Continue to treatments',
    
    // Gender options
    'gender.man': 'Male',
    'gender.vrouw': 'Female',
    
    // Hair types
    'hairtype.fijn': 'Fine hair',
    'hairtype.stijl': 'Straight hair',
    'hairtype.krul': 'Curly hair',
    'hairtype.kroes': 'Coily hair',
    
    // Hair colors
    'haircolor.zwart': 'Black',
    'haircolor.bruin': 'Brown',
    'haircolor.blond': 'Blonde',
    'haircolor.wit': 'White',
    
    // Meta descriptions
    'meta.home.description': 'Discover the most advanced hair transplant techniques and V6 Hairboost treatments at GlobalHair.',
    'meta.haartransplantatie.description': 'Professional hair transplant with the latest techniques and years of experience.',
    'meta.v6hairboost.description': 'V6 Hairboost - revolutionary hair growth treatment for optimal results.',
    
    // Pages
    'page.haartransplantatie.title': 'Hair Transplant',
    'page.v6hairboost.title': 'V6 Hairboost',
    'page.coming-soon': 'Coming Soon',
    
    // Reviews
    'reviews.title': 'Check our reviews',
    'reviews.description': 'Discover what our customers say about their experiences with our treatments.',
    'reviews.close': 'Close',
    
    // Mission
    'mission.title': 'Our Mission',
    'mission.subtitle': 'Excellence in hair care and aesthetics',
    'mission.description1': 'At GlobalHair, we strive for the highest level of hair care and aesthetic treatments. Our mission is to provide every client with natural, lasting results that enhance their confidence.',
    'mission.description2': 'With years of expertise and the latest technologies, we offer personalized care that meets the highest international standards.',
    'mission.description3': 'We believe everyone has the right to feel good about their appearance, and we are here to make that possible.',
    'mission.value1.title': 'Quality',
    'mission.value1.description': 'We maintain the highest quality standards in all aspects of our treatments.',
    'mission.value2.title': 'Innovation',
    'mission.value2.description': 'We continuously invest in the latest techniques and technologies.',
    'mission.value3.title': 'Care',
    'mission.value3.description': 'Personal attention and aftercare are central to our approach.',
    'mission.close': 'Close',
  }
} as const;

export const useTranslation = (language: Language) => {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t };
};