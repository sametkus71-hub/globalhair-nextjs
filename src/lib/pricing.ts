import { UserProfile, Package, Location } from '@/hooks/useSession';

// Base package prices in euros (Netherlands prices)
const PACKAGE_PRICES: Record<Package, number> = {
  'Standard': 8950,
  'Premium': 15950,
  'Advanced': 18950
};

// Turkey discounts per package
const TURKEY_DISCOUNTS: Record<Package, number> = {
  'Standard': -2000,
  'Premium': -3500,
  'Advanced': -4200
};

export const calculatePrice = (profile: UserProfile): number => {
  const basePrice = PACKAGE_PRICES[profile.selectedPackage] || PACKAGE_PRICES.Premium;
  
  if (profile.locatie === 'Turkije') {
    const discount = TURKEY_DISCOUNTS[profile.selectedPackage] || TURKEY_DISCOUNTS.Premium;
    return basePrice + discount;
  }
  
  return basePrice;
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
  const discount = profile.locatie === 'Turkije' ? (TURKEY_DISCOUNTS[profile.selectedPackage] || TURKEY_DISCOUNTS.Premium) : 0;
  const totalPrice = basePrice + discount;
  
  return {
    basePrice,
    locationAdjustment: discount,
    totalPrice,
    packageName: profile.selectedPackage,
    location: profile.locatie
  };
};