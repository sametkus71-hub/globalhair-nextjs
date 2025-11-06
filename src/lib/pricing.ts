import { UserProfile, Package, Location } from '@/hooks/useSession';

// Base package prices in euros (Turkey - cheaper option)
const PACKAGE_PRICES: Record<Package, number> = {
  'Standard': 6950,
  'Premium': 12450,
  'Elite': 14750
};

// Location-based price adjustments (Netherlands is more expensive)
const LOCATION_ADJUSTMENTS: Record<Location, number> = {
  'Nederland': 2000, // Standard: +2000, Premium: +3500, Elite: +4200
  'Turkije': 0
};

// Netherlands specific adjustments per package
const NETHERLANDS_PACKAGE_ADJUSTMENTS: Record<Package, number> = {
  'Standard': 2000,  // 6950 + 2000 = 8950
  'Premium': 3500,   // 12450 + 3500 = 15950
  'Elite': 4200   // 14750 + 4200 = 18950
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