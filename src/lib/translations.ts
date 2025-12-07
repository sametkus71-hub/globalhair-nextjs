import { Language } from '@/hooks/useLanguage';

export const translations = {
  nl: {
    // Navigation
    'nav.home': 'Home',
    'nav.haartransplantatie': 'Haartransplantatie',
    'nav.v6hairboost': 'V6 Hairboost®',
    'nav.dashboard': 'Dashboard',
    'nav.form': 'Haaranalyse',
    
    // Homepage
    'home.title': 'Premium Haartransplantatie & V6 Hairboost®',
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
    'meta.home.description': 'Ontdek de meest geavanceerde haartransplantatie technieken en V6 Hairboost® behandelingen bij GlobalHair.',
    'meta.haartransplantatie.description': 'Professionele haartransplantatie met de nieuwste technieken en jarenlange ervaring.',
    'meta.v6hairboost.description': 'V6 Hairboost® - revolutionaire haargroei behandeling voor optimale resultaten.',
    'meta.behandelopties.description': 'Ontdek gedetailleerde informatie over onze haartransplantatie pakketten en kies de beste behandeling voor u.',
    
    // Pages
    'page.haartransplantatie.title': 'Haartransplantatie',
    'page.v6hairboost.title': 'V6 Hairboost®',
    'page.coming-soon': 'Binnenkort beschikbaar',
    
    // Reviews
    'reviews.title': 'Bekijk onze reviews',
    'reviews.description': 'Ontdek wat onze klanten zeggen over hun ervaringen met onze behandelingen.',
    'reviews.close': 'Sluiten',
    
    // Mission
    'mission.page.title': 'Onze Missie - Precisie is onze missie',
    'mission.page.description': 'Ontdek onze missie van precisie en excellentie in haartransplantatie behandelingen.',
    'mission.main.title': 'PRECISIE IS ONZE MISSIE.',
    'mission.main.subtitle': '+10.000 behandelingen en we blijven groeien.',
    'mission.content.founder': 'Founder & Medisch Directeur, Berkant Dural, zag al op jonge leeftijd wat erfelijk haarverlies met zijn vader deed en hij was ervan overtuigd dat dit voorkomen kon worden. Na jaren onderzoek en samenwerkingen met Tricho artsen ontwikkelde hij een werkwijze niet alleen voor zijn eigen haar, maar ook voor meer.',
    'mission.button.methods': 'bekijk methodes',
    
    // Contact
    'contact.page.title': 'Contact - Hair Excellence',
    'contact.page.description': 'Neem contact met ons op',
    'contact.title': 'MEET YOUR FUTURE HAIRLINE',
    'contact.subtitle': 'Kies uw locatie voor een consult',
    'contact.countries.nederland': 'NEDERLAND',
    'contact.countries.turkije': 'TURKIJE',
    'contact.locations.barendrecht.name': 'BARENDRECHT',
    'contact.locations.barendrecht.subtitle': 'HOOFDKANTOOR',
    'contact.locations.barendrecht.address': 'Pesetastraat 76, 2991 XT Barendrecht',
    'contact.locations.barendrecht.phone': '085 750 0577',
    'contact.locations.barendrecht.hours': 'Ma/di/wo/do/vr 9:00 - 17:00',
    'contact.locations.barendrecht.province': 'Zuid-Holland',
    'contact.locations.leiden.name': 'LEIDEN',
    'contact.locations.leiden.subtitle': 'VESTIGING',
    'contact.locations.leiden.address': 'Stationsweg 46, 2312 AV Leiden',
    'contact.locations.leiden.phone': '071 514 1400',
    'contact.locations.leiden.hours': 'Ma/di/wo/do/vr 9:00 - 17:00',
    'contact.locations.leiden.province': 'Zuid-Holland',
    'contact.locations.istanbul.name': 'ISTANBUL',
    'contact.locations.istanbul.subtitle': 'KLINIEK',
    'contact.locations.istanbul.address': 'Şişli Mahallesi, İstanbul, Turkey',
    'contact.locations.istanbul.phone': '+90 212 555 0123',
    'contact.locations.istanbul.hours': 'Pzt/Sal/Çar/Per/Cum 9:00 - 18:00',
    'contact.locations.istanbul.province': 'Istanbul',
    
    // Treatment options
    'treatment.location.nederland': 'Nederland',
    'treatment.location.turkije': 'Turkije',
    'treatment.shaving.met': 'Met scheren',
    'treatment.shaving.zonder': 'Zonder scheren',
    'treatment.type.normaal': 'Normaal',
    'treatment.type.stamcel': 'Stamcel',
    
    // Review specific
    'review.title': 'Klantervaring',
    'review.treatment': 'Behandeling',
    'review.description': 'Beschrijving',
    'review.back': 'Terug naar reviews',
    
    // Bottom navigation
    'nav.bottom.home': 'Home',
    'nav.bottom.mission': 'Missie', 
    'nav.bottom.reviews': 'Reviews',
    'nav.bottom.book': 'Book',
    
    // Booking
    'booking.step1Title': 'Kies een optie',
    'booking.step2Title': 'Selecteer datum',
    'booking.step3Title': 'Bevestigen',
    'booking.consultType': 'Type consult',
    'booking.basicConsult': 'Basic consult / V6 Hairboost®',
    'booking.basicConsultDesc': '30 minuten persoonlijk consult voor V6 Hairboost® behandeling',
    'booking.trichoScan': 'TrichoScan™ / Haartransplantatie',
    'booking.trichoScanDesc': '45 minuten uitgebreid consult met TrichoScan analyse',
    'booking.locationLabel': 'Locatie',
    'booking.onLocation': 'Op locatie (Barendrecht)',
    'booking.videoCall': 'Videocall',
    'booking.selectConsultant': 'Selecteer consultant',
    'booking.trichoTeam': 'TrichoTeam',
    'booking.ceo': 'CEO - Berkant Dural',
    'booking.totalPrice': 'Totaalprijs',
    'booking.next': 'Volgende',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.haartransplantatie': 'Hair Transplant',
    'nav.v6hairboost': 'V6 Hairboost®',
    'nav.dashboard': 'Dashboard',
    'nav.form': 'Hair Analysis',
    
    // Homepage
    'home.title': 'Premium Hair Transplant & V6 Hairboost®',
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
    'meta.home.description': 'Discover the most advanced hair transplant techniques and V6 Hairboost® treatments at GlobalHair.',
    'meta.haartransplantatie.description': 'Professional hair transplant with the latest techniques and years of experience.',
    'meta.v6hairboost.description': 'V6 Hairboost® - revolutionary hair growth treatment for optimal results.',
    'meta.treatment-options.description': 'Discover detailed information about our hair transplant packages and choose the best treatment for you.',
    
    // Pages
    'page.haartransplantatie.title': 'Hair Transplant',
    'page.v6hairboost.title': 'V6 Hairboost®',
    'page.coming-soon': 'Coming Soon',
    
    // Reviews
    'reviews.title': 'Check our reviews',
    'reviews.description': 'Discover what our customers say about their experiences with our treatments.',
    'reviews.close': 'Close',
    
    // Mission
    'mission.page.title': 'Our Mission - Precision is our mission',
    'mission.page.description': 'Discover our mission of precision and excellence in hair transplant treatments.',
    'mission.main.title': 'PRECISION IS OUR MISSION.',
    'mission.main.subtitle': '+10,000 treatments and we keep growing.',
    'mission.content.founder': 'Founder & Medical Director, Berkant Dural, saw at a young age what hereditary hair loss did to his father and he was convinced that this could be prevented. After years of research and collaborations with Tricho doctors, he developed a method not only for his own hair, but also for more.',
    'mission.button.methods': 'view methods',
    
    // Contact
    'contact.page.title': 'Contact - Hair Excellence',
    'contact.page.description': 'Get in touch with us',
    'contact.title': 'MEET YOUR FUTURE HAIRLINE',
    'contact.subtitle': 'Choose your location for a consultation',
    'contact.countries.nederland': 'NEDERLAND',
    'contact.countries.turkije': 'TURKIJE',
    'contact.locations.barendrecht.name': 'BARENDRECHT',
    'contact.locations.barendrecht.subtitle': 'HEAD OFFICE',
    'contact.locations.barendrecht.address': 'Pesetastraat 76, 2991 XT Barendrecht',
    'contact.locations.barendrecht.phone': '085 750 0577',
    'contact.locations.barendrecht.hours': 'Mon/Tue/Wed/Thu/Fri 9:00 AM - 5:00 PM',
    'contact.locations.barendrecht.province': 'South Holland',
    'contact.locations.leiden.name': 'LEIDEN',
    'contact.locations.leiden.subtitle': 'BRANCH',
    'contact.locations.leiden.address': 'Stationsweg 46, 2312 AV Leiden',
    'contact.locations.leiden.phone': '071 514 1400',
    'contact.locations.leiden.hours': 'Mon/Tue/Wed/Thu/Fri 9:00 AM - 5:00 PM',
    'contact.locations.leiden.province': 'South Holland',
    'contact.locations.istanbul.name': 'ISTANBUL',
    'contact.locations.istanbul.subtitle': 'CLINIC',
    'contact.locations.istanbul.address': 'Şişli District, Istanbul, Turkey',
    'contact.locations.istanbul.phone': '+90 212 555 0123',
    'contact.locations.istanbul.hours': 'Mon/Tue/Wed/Thu/Fri 9:00 AM - 6:00 PM',
    'contact.locations.istanbul.province': 'Istanbul',
    
    // Treatment options
    'treatment.location.nederland': 'Netherlands',
    'treatment.location.turkije': 'Turkey',
    'treatment.shaving.met': 'With shaving',
    'treatment.shaving.zonder': 'Without shaving',
    'treatment.type.normaal': 'Standard',
    'treatment.type.stamcel': 'Stem cell',
    
    // Review specific
    'review.title': 'Customer Experience',
    'review.treatment': 'Treatment',
    'review.description': 'Description',
    'review.back': 'Back to reviews',
    
    // Bottom navigation
    'nav.bottom.home': 'Home',
    'nav.bottom.mission': 'Mission', 
    'nav.bottom.reviews': 'Reviews',
    'nav.bottom.book': 'Book',
    
    // Booking
    'booking.step1Title': 'Choose an option',
    'booking.step2Title': 'Select date',
    'booking.step3Title': 'Confirm',
    'booking.consultType': 'Consultation type',
    'booking.basicConsult': 'Basic consult / V6 Hairboost®',
    'booking.basicConsultDesc': '30 minute personal consultation for V6 Hairboost® treatment',
    'booking.trichoScan': 'TrichoScan™ / Hair Transplant',
    'booking.trichoScanDesc': '45 minute comprehensive consultation with TrichoScan analysis',
    'booking.locationLabel': 'Location',
    'booking.onLocation': 'On location (Barendrecht)',
    'booking.videoCall': 'Video call',
    'booking.selectConsultant': 'Select consultant',
    'booking.trichoTeam': 'TrichoTeam',
    'booking.ceo': 'CEO - Berkant Dural',
    'booking.totalPrice': 'Total price',
    'booking.next': 'Next',
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