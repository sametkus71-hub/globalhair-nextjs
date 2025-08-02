import { useEffect, useState } from 'react';

export type Gender = 'Man' | 'Vrouw';
export type HairType = 'Fijn' | 'Stijl' | 'Krul' | 'Kroes';
export type HairColor = 'Zwart' | 'Bruin' | 'Blond' | 'Rood';

export interface UserProfile {
  geslacht: Gender;
  haartype: HairType;
  haarkleur: HairColor;
}

const defaultProfile: UserProfile = {
  geslacht: 'Man',
  haartype: 'Fijn',
  haarkleur: 'Zwart'
};

export const useSession = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // Initialize from sessionStorage
  useEffect(() => {
    const savedGeslacht = sessionStorage.getItem('gh_geslacht') as Gender;
    const savedHaartype = sessionStorage.getItem('gh_haartype') as HairType;
    const savedHaarkleur = sessionStorage.getItem('gh_haarkleur') as HairColor;

    const currentProfile = {
      geslacht: savedGeslacht || defaultProfile.geslacht,
      haartype: savedHaartype || defaultProfile.haartype,
      haarkleur: savedHaarkleur || defaultProfile.haarkleur
    };

    setProfile(currentProfile);
    
    // Set defaults if not exists
    if (!savedGeslacht) sessionStorage.setItem('gh_geslacht', currentProfile.geslacht);
    if (!savedHaartype) sessionStorage.setItem('gh_haartype', currentProfile.haartype);
    if (!savedHaarkleur) sessionStorage.setItem('gh_haarkleur', currentProfile.haarkleur);

    updateBodyClasses(currentProfile);
  }, []);

  // Update body classes for CSS targeting
  const updateBodyClasses = (newProfile: UserProfile) => {
    const body = document.body;
    
    // Remove existing classes
    body.className = body.className.replace(/s-(man|vrouw|fijn|stijl|krul|kroes|zwart|bruin|blond|rood)/g, '').trim();
    
    // Add new classes
    const geslachtClass = `s-${newProfile.geslacht.toLowerCase()}`;
    const haartypeClass = `s-${newProfile.haartype.toLowerCase()}`;
    const haarkleurClass = `s-${newProfile.haarkleur.toLowerCase()}`;
    
    body.classList.add(geslachtClass, haartypeClass, haarkleurClass);
  };

  // Update specific profile field
  const updateProfile = (field: keyof UserProfile, value: string) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    
    // Update sessionStorage
    sessionStorage.setItem(`gh_${field}`, value);
    
    // Update body classes
    updateBodyClasses(newProfile);
  };

  // Check if profile matches video criteria
  const matchesVideo = (videoProfile: Partial<UserProfile>): boolean => {
    return Object.entries(videoProfile).every(([key, value]) => {
      return !value || profile[key as keyof UserProfile] === value;
    });
  };

  return {
    profile,
    updateProfile,
    matchesVideo,
    isProfileComplete: () => profile.geslacht && profile.haartype && profile.haarkleur
  };
};