import { ServiceType, LocationType } from '@/components/booking/BookingWizard';

export interface BookingState {
  consultType: 'v6_hairboost' | 'haartransplantatie';
  location: LocationType;
  consultant: 'trichoTeam' | 'ceo';
  serviceType: ServiceType | null;
  price: number;
  currentStep: string;
  completedSteps: string[];
  bookingSelection?: {
    date: string;
    time: string;
    staffId: string;
    staffName: string;
  };
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
    postcode: string;
    city: string;
    country: string;
  };
}

const STORAGE_KEY = 'booking_state';

export const saveBookingState = (state: BookingState): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save booking state:', error);
  }
};

export const loadBookingState = (): BookingState | null => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load booking state:', error);
    return null;
  }
};

export const clearBookingState = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear booking state:', error);
  }
};
