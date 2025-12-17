// Service and staff configuration mirrored from supabase/functions/_shared/service-config.ts
'use client';

export interface ServiceConfig {
  serviceId: string;
  staffIds: string[];
  preferredStaffId?: string;
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
    id: '166653000000592010',
    name: 'Özlem Aslan',
  },
  STEVEN: {
    id: '166653000000590040',
    name: 'Steven Kwik',
  },
  BERKANT: {
    id: '166653000000028008',
    name: 'Berkant Dural',
  },
};

// Service configurations
export const SERVICES: Record<string, ServiceConfig> = {
  v6_hairboost_online: {
    serviceId: '166653000000921076',
    staffIds: [STAFF.OZLEM.id, STAFF.STEVEN.id],
    preferredStaffId: STAFF.STEVEN.id,
    durationMinutes: 30,
    priceEuros: 50,
  },
  v6_hairboost_onsite: {
    serviceId: '166653000000921058',
    staffIds: [STAFF.OZLEM.id, STAFF.STEVEN.id],
    preferredStaffId: STAFF.STEVEN.id,
    durationMinutes: 30,
    priceEuros: 50,
  },
  haartransplantatie_online: {
    serviceId: '166653000000079229',
    staffIds: [STAFF.OZLEM.id, STAFF.STEVEN.id],
    preferredStaffId: STAFF.STEVEN.id,
    durationMinutes: 45,
    priceEuros: 75,
  },
  haartransplantatie_onsite: {
    serviceId: '166653000000921040',
    staffIds: [STAFF.OZLEM.id, STAFF.STEVEN.id],
    preferredStaffId: STAFF.STEVEN.id,
    durationMinutes: 45,
    priceEuros: 75,
  },
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
