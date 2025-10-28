// Service and staff configuration for Zoho Bookings

export interface ServiceConfig {
  serviceId: string;
  staffIds: string[]; // Can be multiple for TrichoTeam
  preferredStaffId?: string; // For when both staff are available
  durationMinutes: number;
  priceEuros: number;
}

export interface StaffInfo {
  id: string;
  name: string;
}

// Staff members
export const STAFF: Record<string, StaffInfo> = {
  OZLEM: {
    id: '166653000000028003',
    name: 'Özlem',
  },
  STEVEN: {
    id: '166653000000028001',
    name: 'Steven',
  },
  BERKANT: {
    id: '166653000000028008',
    name: 'Berkant Dural',
  },
};

// Service configurations
export const SERVICES: Record<string, ServiceConfig> = {
  // V6 Hairboost Online
  v6_hairboost_online: {
    serviceId: '166653000001098006',
    staffIds: [STAFF.OZLEM.id, STAFF.STEVEN.id],
    preferredStaffId: STAFF.STEVEN.id,
    durationMinutes: 30,
    priceEuros: 50,
  },
  
  // V6 Hairboost Onsite
  v6_hairboost_onsite: {
    serviceId: '166653000001085013',
    staffIds: [STAFF.OZLEM.id, STAFF.STEVEN.id],
    preferredStaffId: STAFF.STEVEN.id,
    durationMinutes: 30,
    priceEuros: 50,
  },
  
  // Haartransplantatie Online
  haartransplantatie_online: {
    serviceId: '166653000001085009',
    staffIds: [STAFF.OZLEM.id, STAFF.STEVEN.id],
    preferredStaffId: STAFF.STEVEN.id,
    durationMinutes: 45,
    priceEuros: 75,
  },
  
  // Haartransplantatie Onsite
  haartransplantatie_onsite: {
    serviceId: '166653000001037020',
    staffIds: [STAFF.OZLEM.id, STAFF.STEVEN.id],
    preferredStaffId: STAFF.STEVEN.id,
    durationMinutes: 45,
    priceEuros: 75,
  },
  
  // CEO Consultation
  ceo_consult_online: {
    serviceId: '166653000001229002',
    staffIds: [STAFF.BERKANT.id],
    durationMinutes: 30,
    priceEuros: 500,
  },
  
  ceo_consult_onsite: {
    serviceId: '166653000001229002',
    staffIds: [STAFF.BERKANT.id],
    durationMinutes: 30,
    priceEuros: 500,
  },
};

/**
 * Get service configuration by type and location
 */
export function getServiceConfig(
  serviceType: 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult',
  location: 'online' | 'onsite'
): ServiceConfig {
  const key = `${serviceType}_${location}`;
  const config = SERVICES[key];
  
  if (!config) {
    throw new Error(`Unknown service: ${key}`);
  }
  
  return config;
}

/**
 * Get staff name by ID
 */
export function getStaffName(staffId: string): string {
  for (const staff of Object.values(STAFF)) {
    if (staff.id === staffId) {
      return staff.name;
    }
  }
  return 'Unknown Staff';
}
