import { useEffect, useState } from 'react';

export type Gender = 'Man' | 'Vrouw';
export type HairType = 'Fijn' | 'Stijl' | 'Krul' | 'Kroes';
export type HairColor = 'Zwart' | 'Bruin' | 'Blond' | 'Wit';
export type Location = 'Nederland' | 'Turkije';
export type Shaving = 'Met scheren' | 'Zonder scheren';
export type Treatment = 'Normaal' | 'Stamcel';
export type Language = 'nl' | 'en';
export type Package = 'Standard' | 'Plus' | 'Premium' | 'Advanced';

export interface UserProfile {
  geslacht: Gender;
  haartype: HairType;
  haarkleur: HairColor;
  locatie: Location;
  scheren: Shaving;
  behandeling: Treatment;
  language: Language;
  selectedPackage: Package;
}

const defaultProfile: UserProfile = {
  geslacht: 'Man',
  haartype: 'Fijn',
  haarkleur: 'Zwart',
  locatie: 'Nederland',
  scheren: 'Met scheren',
  behandeling: 'Normaal',
  language: 'nl',
  selectedPackage: 'Standard'
};

export const useSession = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // Detect browser language preference
  const detectBrowserLanguage = (): Language => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    return 'nl'; // Default to Dutch
  };

  // Initialize from sessionStorage and set up listeners
  useEffect(() => {
    const loadProfile = () => {
      const savedGeslacht = sessionStorage.getItem('gh_geslacht') as Gender;
      const savedHaartype = sessionStorage.getItem('gh_haartype') as HairType;
      const savedHaarkleur = sessionStorage.getItem('gh_haarkleur') as HairColor;
      const savedLocatie = sessionStorage.getItem('gh_locatie') as Location;
      const savedScheren = sessionStorage.getItem('gh_scheren') as Shaving;
      const savedBehandeling = sessionStorage.getItem('gh_behandeling') as Treatment;
      const savedSelectedPackage = sessionStorage.getItem('gh_selectedPackage') as Package;
      
      // Language detection: prioritize sessionStorage, then localStorage, then browser
      const savedLanguageSession = sessionStorage.getItem('gh_language') as Language;
      const savedLanguageLocal = localStorage.getItem('gh_lang') as Language;
      const detectedLanguage = savedLanguageSession || savedLanguageLocal || detectBrowserLanguage();

      const currentProfile = {
        geslacht: savedGeslacht || defaultProfile.geslacht,
        haartype: savedHaartype || defaultProfile.haartype,
        haarkleur: savedHaarkleur || defaultProfile.haarkleur,
        locatie: savedLocatie || defaultProfile.locatie,
        scheren: savedScheren || defaultProfile.scheren,
        behandeling: savedBehandeling || defaultProfile.behandeling,
        language: detectedLanguage,
        selectedPackage: savedSelectedPackage || defaultProfile.selectedPackage
      };

      setProfile(currentProfile);
      
      // Set defaults if not exists - sync both storages for language
      if (!savedGeslacht) sessionStorage.setItem('gh_geslacht', currentProfile.geslacht);
      if (!savedHaartype) sessionStorage.setItem('gh_haartype', currentProfile.haartype);
      if (!savedHaarkleur) sessionStorage.setItem('gh_haarkleur', currentProfile.haarkleur);
      if (!savedLocatie) sessionStorage.setItem('gh_locatie', currentProfile.locatie);
      if (!savedScheren) sessionStorage.setItem('gh_scheren', currentProfile.scheren);
      if (!savedBehandeling) sessionStorage.setItem('gh_behandeling', currentProfile.behandeling);
      if (!savedSelectedPackage) sessionStorage.setItem('gh_selectedPackage', currentProfile.selectedPackage);
      
      // Sync language in both storages
      sessionStorage.setItem('gh_language', currentProfile.language);
      localStorage.setItem('gh_lang', currentProfile.language);

      updateBodyClasses(currentProfile);
      return currentProfile;
    };

    // Load initial profile
    loadProfile();

    // Listen for storage changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('gh_')) {
        loadProfile();
      }
    };

    // Listen for custom profile update events
    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdate', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdate', handleProfileUpdate);
    };
  }, []);

  // Update body classes for CSS targeting
  const updateBodyClasses = (newProfile: UserProfile) => {
    const body = document.body;
    
    // Remove existing classes
    body.className = body.className.replace(/s-(man|vrouw|fijn|stijl|krul|kroes|zwart|bruin|blond|wit|nederland|turkije|met-scheren|zonder-scheren|normaal|stamcel|nl|en|standard|plus|premium|advanced)/g, '').trim();
    
    // Add new classes
    const geslachtClass = `s-${newProfile.geslacht.toLowerCase()}`;
    const haartypeClass = `s-${newProfile.haartype.toLowerCase()}`;
    const haarkleurClass = `s-${newProfile.haarkleur.toLowerCase()}`;
    const locatieClass = `s-${newProfile.locatie.toLowerCase()}`;
    const scherenClass = `s-${newProfile.scheren.toLowerCase().replace(' ', '-')}`;
    const behandelingClass = `s-${newProfile.behandeling.toLowerCase()}`;
    const languageClass = `s-${newProfile.language}`;
    const packageClass = `s-${newProfile.selectedPackage.toLowerCase()}`;
    
    body.classList.add(geslachtClass, haartypeClass, haarkleurClass, locatieClass, scherenClass, behandelingClass, languageClass, packageClass);
  };

  // Update specific profile field
  const updateProfile = (field: keyof UserProfile, value: string) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    
    // Update sessionStorage (using special key for language)
    const storageKey = field === 'language' ? 'gh_language' : `gh_${field}`;
    sessionStorage.setItem(storageKey, value);
    
    // For language, also sync localStorage for URL routing compatibility
    if (field === 'language') {
      localStorage.setItem('gh_lang', value);
    }
    
    // Update body classes
    updateBodyClasses(newProfile);
    
    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent('profileUpdate', { 
      detail: { field, value, profile: newProfile } 
    }));
    
    console.info('Profile updated:', newProfile);
  };

  // Check if profile matches video criteria
  const matchesVideo = (videoProfile: Partial<UserProfile>): boolean => {
    return Object.entries(videoProfile).every(([key, value]) => {
      return !value || profile[key as keyof UserProfile] === value;
    });
  };

  // Language-specific methods
  const updateLanguage = (newLanguage: Language) => {
    updateProfile('language', newLanguage);
  };

  return {
    profile,
    updateProfile,
    updateLanguage,
    matchesVideo,
    isProfileComplete: () => profile.geslacht && profile.haartype && profile.haarkleur,
    language: profile.language
  };
};