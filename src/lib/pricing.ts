import { UserProfile, Package, Location } from '@/hooks/useSession';

// Base package prices in euros
const PACKAGE_PRICES: Record<Package, number> = {
  'Standard': 7500,
  'Plus': 10000,
  'Premium': 12500,
  'Advanced': 15000
};

// Location-based price adjustments
const LOCATION_ADJUSTMENTS: Record<Location, number> = {
  'Nederland': 0,
  'Turkije': 3000
};

export const calculatePrice = (profile: UserProfile): number => {
  const basePrice = PACKAGE_PRICES[profile.selectedPackage] || PACKAGE_PRICES.Standard;
  const locationAdjustment = LOCATION_ADJUSTMENTS[profile.locatie] || 0;
  
  return basePrice + locationAdjustment;
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
  const basePrice = PACKAGE_PRICES[profile.selectedPackage] || PACKAGE_PRICES.Standard;
  const locationAdjustment = LOCATION_ADJUSTMENTS[profile.locatie] || 0;
  const totalPrice = basePrice + locationAdjustment;
  
  return {
    basePrice,
    locationAdjustment,
    totalPrice,
    packageName: profile.selectedPackage,
    location: profile.locatie
  };
};