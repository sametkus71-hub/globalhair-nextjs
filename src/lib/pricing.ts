import { UserProfile } from '@/hooks/useSession';

export const PRICING_CONFIG = {
  base: 9000,
  modifiers: {
    locatie: { 
      'Turkije': 3000, 
      'Nederland': 0 
    },
    scheren: { 
      'Zonder scheren': 1000, 
      'Met scheren': 0 
    },
    behandeling: { 
      'Stamcel': 1500, 
      'Normaal': 0 
    }
  }
};

export const calculatePrice = (profile: UserProfile): number => {
  let totalPrice = PRICING_CONFIG.base;
  
  totalPrice += PRICING_CONFIG.modifiers.locatie[profile.locatie] || 0;
  totalPrice += PRICING_CONFIG.modifiers.scheren[profile.scheren] || 0;
  totalPrice += PRICING_CONFIG.modifiers.behandeling[profile.behandeling] || 0;
  
  return totalPrice;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};