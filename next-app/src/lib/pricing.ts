'use client';

import { UserProfile, Package, Location } from '@/hooks/useSession';

// Base package prices in euros (Turkey - cheaper option)
const PACKAGE_PRICES: Record<Package, number> = {
  'Standard': 4950,
  'Premium': 8950,
  'Elite': 14750
};

// Location-based price adjustments (Netherlands is more expensive)
const LOCATION_ADJUSTMENTS: Record<Location, number> = {
  'Nederland': 2300, // Standard: +2300, Premium: +4000, Elite: +7200
  'Turkije': 0
};

// Netherlands specific adjustments per package
const NETHERLANDS_PACKAGE_ADJUSTMENTS: Record<Package, number> = {
  'Standard': 2300,  // 4950 + 2300 = 7250
  'Premium': 4000,   // 8950 + 4000 = 12950
  'Elite': 7200      // 14750 + 7200 = 21950
};

export const calculatePrice = (profile: UserProfile): number => {
  const basePrice = PACKAGE_PRICES[profile.selectedPackage] || PACKAGE_PRICES.Premium;
  const netherlandsAdjustment = profile.locatie === 'Nederland' 
    ? NETHERLANDS_PACKAGE_ADJUSTMENTS[profile.selectedPackage] || NETHERLANDS_PACKAGE_ADJUSTMENTS.Premium
    : 0;
  
  return basePrice + netherlandsAdjustment;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const getPriceBreakdown = (profile: UserProfile) => {
  const basePrice = PACKAGE_PRICES[profile.selectedPackage] || PACKAGE_PRICES.Premium;
  const netherlandsAdjustment = profile.locatie === 'Nederland' 
    ? NETHERLANDS_PACKAGE_ADJUSTMENTS[profile.selectedPackage] || NETHERLANDS_PACKAGE_ADJUSTMENTS.Premium
    : 0;
  const totalPrice = basePrice + netherlandsAdjustment;
  
  return {
    basePrice,
    locationAdjustment: netherlandsAdjustment,
    totalPrice,
    packageName: profile.selectedPackage,
    location: profile.locatie
  };
};