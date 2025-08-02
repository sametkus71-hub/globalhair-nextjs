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
    'haircolor.rood': 'Rood',
    
    // Meta descriptions
    'meta.home.description': 'Ontdek de meest geavanceerde haartransplantatie technieken en V6 Hairboost behandelingen bij GlobalHair.',
    'meta.haartransplantatie.description': 'Professionele haartransplantatie met de nieuwste technieken en jarenlange ervaring.',
    'meta.v6hairboost.description': 'V6 Hairboost - revolutionaire haargroei behandeling voor optimale resultaten.',
    
    // Pages
    'page.haartransplantatie.title': 'Haartransplantatie',
    'page.v6hairboost.title': 'V6 Hairboost',
    'page.coming-soon': 'Binnenkort beschikbaar',
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
    'haircolor.rood': 'Red',
    
    // Meta descriptions
    'meta.home.description': 'Discover the most advanced hair transplant techniques and V6 Hairboost treatments at GlobalHair.',
    'meta.haartransplantatie.description': 'Professional hair transplant with the latest techniques and years of experience.',
    'meta.v6hairboost.description': 'V6 Hairboost - revolutionary hair growth treatment for optimal results.',
    
    // Pages
    'page.haartransplantatie.title': 'Hair Transplant',
    'page.v6hairboost.title': 'V6 Hairboost',
    'page.coming-soon': 'Coming Soon',
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